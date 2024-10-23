import Image from "next/image";
import Author from "../assets/author.jpg";

export default function AuthorBio() {
  return (
    <section id="about" className="py-16 bg-white">
              <h1 className="text-4xl font-bold text-center text-[#00b4d8] mb-10">About Us</h1>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Container for About Blogista and Author */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-4">
          {/* About Blogista Section */}
          <div className="about-blogista shadow-lg p-4">
            <h2 className="text-4xl mx-auto font-bold text-gray-900 mb-6 text-center">
              Welcome to <span className="text-[#00b4d8]">Blogista</span>
            </h2>

            <p className="text-lg text-center text-gray-600 mb-4 leading-relaxed">
              Blogista is your one-stop destination for insightful web
              development tutorials, news, and resources. Whether you're new to
              the field or an experienced developer, we bring you up-to-date
              content that helps you sharpen your skills and grow.
            </p>
            <p className="text-lg text-center text-gray-600 leading-relaxed">
              With a focus on modern web frameworks like JavaScript and React,
              we aim to create a vibrant community of developers who love
              learning and sharing knowledge. Let's build together and stay
              ahead in the ever-evolving tech world!
            </p>
          </div>

          {/* About the Author Section */}
          <div className="author-info shadow-lg p-4 text-center md:text-left">
            <Image
              src={Author}
              alt="Author"
              className="w-40 h-40 rounded-full mx-auto mb-6 shadow-lg border-4 border-[#00b4d8]"
            />

            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Muhammad Haseeb
            </h2>
            <p className="text-lg text-center text-gray-600 leading-relaxed">
              Assalam u Alaikum! I'm a passionate web developer and blogger with
              a love for writing tutorials on cutting-edge web technologies. My
              expertise spans JavaScript, React, and other modern frameworks.
              Join me as we explore the exciting world of web development
              together!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
