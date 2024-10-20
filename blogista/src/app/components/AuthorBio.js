// components/AuthorBio.js
import Image from "next/image";
import Author from "../assets/author.jpg";


export default function AuthorBio() {
    return (
      <section id="author" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 flex flex-col items-center">
          <Image
            src={Author}
            alt="Author"
            className="w-40 h-40 rounded-full mb-6"
          />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">About the Author</h2>
          <p className="text-lg text-gray-700 text-center max-w-2xl">
            Assalam u Alikum! I'm Muhammad Haseeb, a passionate web developer and blogger. I love writing
            tutorials on web technologies, sharing my insights on JavaScript, React,
            and other modern frameworks. Join me on my journey as we explore the
            ever-changing landscape of web development!
          </p>
        </div>
      </section>
    );
  }
  