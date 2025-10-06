// backend/server.js
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ----------------- DB CONNECTION -----------------
const pool = new Pool({
  user: process.env.DB_USER || "your_username",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "eco_byte",
  password: process.env.DB_PASSWORD || "sriharsha",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

pool
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL Database"))
  .catch((err) => {
    console.error("❌ DB Connection Error:", err.message);
    process.exit(1);
  });

// ----------------- ROOT -----------------
app.get("/", (req, res) => {
  res.send("🌍 Eco-Byte Backend Running 🚀");
});

// ----------------- CUSTOM CHECK USER ENDPOINT -----------------
// Check if phone exists in users table
app.get("/api/check-user", async (req, res) => {
  const { phone } = req.query;
  if (!phone || phone.length !== 10) {
    return res.status(400).json({ error: "Invalid phone number" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE phone = $1", [phone]);
    res.json({ exists: result.rows.length > 0 });
  } catch (error) {
    console.error("Error checking user existence:", error);
    res.status(500).json({ error: "Failed to check user existence" });
  }
});

// ----------------- USERS API -----------------
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching users:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error fetching user by ID:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2, phone=$3 WHERE user_id=$4 RETURNING *`,
      [name, email, phone, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error updating user:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------- QUOTATIONS API -----------------
app.get("/api/quotations", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM quotations ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching quotations:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/quotations", async (req, res) => {
  const { name, phone, address, message } = req.body;

  if (!name || !phone || !address) {
    return res.status(400).json({ error: "Name, phone, and address are required" });
  }

  const client = await pool.connect();

  try {
    const insertQuery = `
      INSERT INTO quotations (name, phone, address, message, status)
      VALUES ($1, $2, $3, $4, 'incomplete')
      RETURNING *`;

    const values = [name, phone, address, message];
    const result = await client.query(insertQuery, values);

    client.release();
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting quotation:", err.message);
    res.status(500).json({ error: "Database insert failed" });
  }
});

app.get("/api/quotations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM quotations WHERE quotation_id=$1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Quotation not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error fetching quotation:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/quotations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address, message } = req.body;

    const result = await pool.query(
      `UPDATE quotations
       SET name=$1, phone=$2, address=$3, message=$4
       WHERE quotation_id=$5 RETURNING *`,
      [name, phone, address, message, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "Quotation not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error updating quotation:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/quotations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM quotations WHERE quotation_id=$1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Quotation not found" });
    res.json({ success: true, deleted: result.rows[0] });
  } catch (err) {
    console.error("❌ Error deleting quotation:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.patch("/api/quotations/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["incomplete", "completed"].includes(status.toLowerCase())) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const query = `
      UPDATE quotations
      SET status = $1
      WHERE quotation_id = $2
      RETURNING *`;
    const values = [status.toLowerCase(), id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Quotation not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error updating quotation status:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------- PRICE LIST -----------------
const UPLOADS_FOLDER = path.join(__dirname, "uploads");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_FOLDER);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: multer.memoryStorage() }); // Store file in memory, not on disk

  app.post("/api/price-list-admin", upload.single("image"), async (req, res) => {
    const { item_name, min_price, max_price } = req.body;
    const imageFile = req.file;

    if (!item_name || !min_price || !max_price) {
      return res.status(400).json({ error: "Item name and prices are required" });
    }
    if (!imageFile) {
      return res.status(400).json({ error: "Image file is required" });
    }

    try {
      const result = await pool.query(
        `INSERT INTO price_list
        (item_name, min_price, max_price, image_data, image_filename, image_mime, added_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING *`,
        [
          item_name,
          parseInt(min_price, 10),
          parseInt(max_price, 10),
          imageFile.buffer,
          imageFile.originalname,
          imageFile.mimetype,
        ]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("Error inserting price list item:", err.message);
      res.status(500).json({ error: "Database insert failed" });
    }
  });

  app.put("/api/price-list-admin/:id", upload.single("image"), async (req, res) => {
    const itemId = Number(req.params.id);
    const { item_name, min_price, max_price } = req.body;
    const imageFile = req.file;

    if (!item_name || !min_price || !max_price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      let query, values;

      if (imageFile) {
        query = `
          UPDATE price_list
          SET item_name = $1, min_price = $2, max_price = $3, 
              image_data = $4, image_filename = $5, image_mime = $6
          WHERE id = $7
          RETURNING *`;
        values = [
          item_name,
          parseInt(min_price, 10),
          parseInt(max_price, 10),
          imageFile.buffer,
          imageFile.originalname,
          imageFile.mimetype,
          itemId,
        ];
      } else {
        query = `
          UPDATE price_list
          SET item_name = $1, min_price = $2, max_price = $3
          WHERE id = $4
          RETURNING *`;
        values = [item_name, parseInt(min_price, 10), parseInt(max_price, 10), itemId];
      }

      const result = await pool.query(query, values);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Item not found" });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error("Error updating price list item:", err.message);
      res.status(500).json({ error: "Database update failed" });
    }
  });

  app.delete("/api/price-list-admin/:id", async (req, res) => {
    const itemId = Number(req.params.id);

    try {
      const result = await pool.query("DELETE FROM price_list WHERE id = $1 RETURNING *", [itemId]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Item not found" });
      }

      res.json({ message: "Item deleted successfully" });
    } catch (err) {
      console.error("Error deleting price list item:", err.message);
      res.status(500).json({ error: "Database delete failed" });
    }
  });

  app.get("/api/price-list-admin", async (req, res) => {
    try {
      const result = await pool.query("SELECT id, item_name, min_price, max_price, image_data, image_mime FROM price_list ORDER BY id");
      const items = result.rows.map(row => ({
        id: row.id,
        item_name: row.item_name,
        min_price: row.min_price,
        max_price: row.max_price,
        image_url: row.image_data ? `data:${row.image_mime};base64,${row.image_data.toString("base64")}` : null,
      }));
      res.json(items);
    } catch (err) {
      console.error("Error fetching price list items:", err.message);
      res.status(500).json({ error: "Database query failed" });
    }
  });

  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ----------------- PINCODES -----------------
app.get("/api/pincodes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM service_pincodes ORDER BY created_at DESC");
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No pin code found" });
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pincodes" });
  }
});

app.get("/api/pincodes/check/:pincode", async (req, res) => {
  const { pincode } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM service_pincodes WHERE pincode = $1 AND is_active = TRUE",
      [pincode]
    );
    if (result.rows.length > 0) {
      res.json({ available: true });
    } else {
      res.json({ available: false });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to check pincode availability" });
  }
});

app.post("/api/pincodes", async (req, res) => {
  const { pincode } = req.body;
  try {
    const exists = await pool.query(
      "SELECT 1 FROM service_pincodes WHERE pincode = $1",
      [pincode]
    );
    if (exists.rows.length > 0) {
      return res.status(400).json({ error: "Pincode already exists" });
    }

    const result = await pool.query(
      "INSERT INTO service_pincodes (pincode) VALUES ($1) RETURNING *",
      [pincode]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to add pincode" });
  }
});

app.put("/api/pincodes/:id/toggle", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE service_pincodes SET is_active = NOT is_active WHERE id = $1 RETURNING *",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

// ----------------- BOOKINGS -----------------
// app.post("/api/bookings", async (req, res) => {
//   console.log("Booking request body:", req.body);

//   const {
//     area_type,
//     order_type,
//     address,
//     alternate_number,
//     scrap_type,
//     pickup_date,
//     status = "incomplete",
//   } = req.body;

//   if (
//     !area_type ||
//     !order_type ||
//     !address ||
//     !alternate_number ||
//     !scrap_type ||
//     !pickup_date
//   ) {
//     console.log("Missing required fields");
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   try {
//     const insertQuery = `INSERT INTO pickups 
//       (area_type, order_type, address, alternate_number, scrap_type, pickup_date, status, created_at)
//       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
//       RETURNING *`;

//     const values = [
//       area_type,
//       order_type,
//       address,
//       alternate_number,
//       scrap_type,
//       pickup_date,
//       status.toLowerCase(),
//     ];

//     const result = await pool.query(insertQuery, values);

//     console.log("Insert success:", result.rows);
//     res.status(201).json(result.rows);
//   } catch (err) {
//     console.error("Error inserting booking:", err);
//     res.status(500).json({ error: "Database insert failed" });
//   }
// });

app.get('/api/bookings', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         p.pickup_id, p.area_type, p.order_type, p.address, 
         p.alternate_number, p.scrap_type, p.pickup_date, p.created_at, p.status,
         u.id AS user_id, u.name AS user_name, u.phone AS user_phone
       FROM pickups p
       LEFT JOIN users u ON p.user_id = u.id
       ORDER BY p.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching bookings:', err.message);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});


app.patch('/api/bookings/:pickupId/status', async (req, res) => {
  const { pickupId } = req.params;
  const { status } = req.body;

  if (!status || !['complete', 'completed', 'incomplete', 'cancelled'].includes(status.toLowerCase())) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const result = await pool.query(
      `UPDATE pickups SET status = $1 WHERE pickup_id = $2 RETURNING *`,
      [status.toLowerCase(), pickupId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating booking status:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Check if a user already exists with the given phone number
app.get("/api/check-user", async (req, res) => {
  const { phone } = req.query;
  if (!phone || phone.length !== 10) {
    return res.status(400).json({ error: "Invalid phone number" });
  }
  try {
    const result = await pool.query("SELECT 1 FROM users WHERE phone = $1", [phone]);
    res.json({ exists: result.rows.length > 0 });
  } catch (error) {
    console.error("Error checking user existence:", error);
    res.status(500).json({ error: "Failed to check user existence" });
  }
});
app.post("/users", async (req, res) => {
  const { phone, name, email } = req.body;
  if (!phone || !name || !email) {
    return res.status(400).json({ error: "Phone, Name, and Email are required." });
  }
  const client = await pool.connect();
  try {
    const existsResult = await client.query(
      "SELECT 1 FROM users WHERE phone = $1 OR email = $2",
      [phone, email]
    );
    if (existsResult.rows.length > 0) {
      return res.status(409).json({ error: "Phone or email already exists." });
    }
    const result = await client.query(
      "INSERT INTO users (phone, name, email, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
      [phone, name, email]
    );
    res.status(201).json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error("Error inserting user:", err.message);
    res.status(500).json({ error: "Database insert failed" });
  } finally {
    client.release();
  }
});



app.post("/api/login", async (req, res) => {
  const { phone } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE phone=$1", [phone]);
    if (result.rows.length > 0) {
      res.json({ success: true, otp: "1234", user: result.rows[0] });
    } else {
      res.json({ success: false, message: "User not valid" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer token

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // user object contains id, name, phone, etc.
    next();
  });
}

app.post("/api/bookings", async (req, res) => {
  const {
    area_type,
    order_type,
    address,
    alternate_number,
    scrap_type,
    pickup_date,
    status = "incomplete",
    user_id,
    user_name,
    user_phone,
  } = req.body;

  if (
    !area_type ||
    !order_type ||
    !address ||
    !alternate_number ||
    !scrap_type ||
    !pickup_date ||
    !user_id ||
    !user_name ||
    !user_phone
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const insertQuery = `
      INSERT INTO pickups 
      (area_type, order_type, address, alternate_number, scrap_type, pickup_date, status, created_at, user_id, user_name, user_phone)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8, $9, $10)
      RETURNING *`;

    const values = [
      area_type,
      order_type,
      address,
      alternate_number,
      scrap_type,
      pickup_date,
      status.toLowerCase(),
      user_id,
      user_name,
      user_phone,
    ];

    const result = await pool.query(insertQuery, values);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting booking:", err);
    res.status(500).json({ error: "Database insert failed" });
  }
});

// Dummy authentication middleware - replace with your JWT verification
function authenticateToken(req, res, next) {
  // In real code, verify token and set req.user
  req.user = { id: 1 }; // example user id
  next();
}

app.use(authenticateToken);

app.get("/api/requests", async (req, res) => {
  const { status } = req.query;
  const userId = req.user.id;

  let query = "SELECT * FROM pickups WHERE user_id = $1";
  const values = [userId];

  if (status) {
    if (status.toLowerCase() === "upcoming") {
      query += " AND status = $2";
      values.push("incomplete");
    } else {
      query += " AND status = $2";
      values.push(status.toLowerCase());
    }
  }

  query += " ORDER BY created_at DESC";

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("DB query error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});
app.patch("/api/requests/:id/cancel", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "UPDATE pickups SET status = 'cancelled', cancelled_at = NOW() WHERE pickup_id = $1 AND user_id = $2 RETURNING *"

      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Request not found or unauthorized" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating request status:", err);
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/api/address", authenticateToken, async (req, res) => {
  try {
    const { pincode, city, location, landmark, full_address } = req.body;

    // Get from JWT
    const userId = req.user.user_id;
    const userName = req.user.user_name;

    const query = `
      INSERT INTO address 
      (pincode, city, location, landmark, full_address, created_at, updated_at, user_id, user_name)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), $6, $7)
      RETURNING *;
    `;

    const values = [pincode, city, location, landmark, full_address, userId, userName];
    const result = await pool.query(query, values);

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;

    // Check if user exists
    const userResult = await pool.query("SELECT * FROM users WHERE phone = $1", [phone]);
    if (userResult.rows.length === 0) {
      return res.json({ success: false, message: "User not found, please sign up" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await pool.query(
      "INSERT INTO otps (phone, otp, created_at, expires_at) VALUES ($1, $2, NOW(), $3)",
      [phone, otp, expiresAt]
    );

    // Send OTP via SMS provider (Twilio/SMSIndiaHub)...

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

app.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ success: false, message: "Phone & OTP required" });

  try {
    const result = await pool.query(
      "SELECT * FROM otps WHERE phone=$1 AND otp=$2 AND expires_at > NOW()",
      [phone, otp]
    );

    if (result.rows.length === 0) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    // Mark as verified
    await pool.query("UPDATE otps SET is_verified=true WHERE phone=$1", [phone]);

    // Fetch or create user
    let user = await pool.query("SELECT * FROM users WHERE phone=$1", [phone]);
    if (user.rows.length === 0) {
      user = await pool.query(
        "INSERT INTO users (phone, created_at) VALUES ($1, NOW()) RETURNING *",
        [phone]
      );
    }

    res.json({ success: true, user: user.rows[0] });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// Send OTP for signup
app.post("/send-otp-signup", async (req, res) => {
  try {
    const { phone } = req.body;
    const userResult = await pool.query("SELECT * FROM users WHERE phone = $1", [phone]);
    if (userResult.rows.length > 0) {
      return res.json({ success: false, message: "User already exists, please login" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    console.log(`OTP for ${phone} : ${otp}`);  // Print OTP & phone here

    await pool.query(
      "INSERT INTO otps (phone, otp, created_at, expires_at) VALUES ($1, $2, NOW(), $3)",
      [phone, otp, expiresAt]
    );

    // TODO: send SMS via provider

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error sending signup OTP:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

// In /verify-otp, REMOVE THE USER INSERTION LOGIC!
app.post("/verify-otp-signup", async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ success: false, message: "Phone & OTP required" });

  try {
    const result = await pool.query(
      "SELECT * FROM otps WHERE phone=$1 AND otp=$2 AND expires_at > NOW()",
      [phone, otp]
    );
    if (result.rows.length === 0) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }
    await pool.query("UPDATE otps SET is_verified=true WHERE phone=$1", [phone]);
    // DO NOT insert/create user here!
    res.json({ success: true, message: "OTP verified" });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



// ----------------- START SERVER -----------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
