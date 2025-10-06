import React from "react";
import "../styles/blog.css";

const blogPosts = [
  {
    id: 1,
    title: "What Happens to Your Old Smartphone?",
    date: "August 10, 2025",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    description:
      "Most smartphones end up in landfills, leaking toxic chemicals. Learn how proper e-waste recycling gives them a new life."
  },
  {
    id: 2,
    title: "5 Easy Steps to Reduce E-Waste at Home",
    date: "August 12, 2025",
    img: "https://greentekreman.com/wp-content/uploads/2023/09/FMRrZwnXoAQMuk9.jpg",
    description:
      "Simple habits like donating, repairing, and recycling can make a big difference in reducing e-waste."
  },
  {
    id: 3,
    title: "Why Vijayawada Needs More E-Waste Centers",
    date: "August 14, 2025",
    img: "https://images.unsplash.com/photo-1508780709619-79562169bc64",
    description:
      "With rising electronic consumption, proper disposal facilities are essential to keep our city clean and green."
  },
  {
    id: 4,
    title: "Safe Disposal of Batteries",
    date: "August 15, 2025",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRIrbXlVqgK4d6-WPXU3ypGu-1wHBidTQnfw&s ",
    description:
      "Batteries contain harmful chemicals. Learn safe disposal methods to prevent soil and water pollution."
  },
    {
    id: 5,
    title: "How E-Waste Recycling Creates Jobs",
    date: "August 17, 2025",
    img: "https://techchefewaste.in/wp-content/uploads/2023/07/Benefits-of-Ewaste-Recycling.jpg",
    description:
      "Recycling isn’t just good for the planet. It also generates employment in collection, processing, and manufacturing."
  },
  {
    id: 6,
    title: "Top 10 Recyclable Electronic Items",
    date: "August 18, 2025",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzFYpuSOLVHLFN5lkiY7unHEMWagYMY_EAJg&s",
    description:
      "From old laptops to broken headphones, here’s a list of electronics you can recycle instead of throwing away."
  },
   {
    id:7 ,
    title: "What Happens to Your Old Smartphone?",
    date: "August 10, 2025",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    description:
      "Most smartphones end up in landfills, leaking toxic chemicals. Learn how proper e-waste recycling gives them a new life."
  },
];

const BlogPage = () => {
  return (
    <div className="blog-container">
      <h1 className="blog-title">Our Blog</h1>
      <p className="blog-subtitle">
        Learn more about E-Waste, Recycling, and Sustainable Living
      </p>
      <div className="blog-grid">
        {blogPosts.map((post) => (
          <div key={post.id} className="blog-card">
            <img src={post.img} alt={post.title} className="blog-img" />
            <div className="blog-content">
              <h2>{post.title}</h2>
              <span className="blog-date">{post.date}</span>
              <p>{post.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
