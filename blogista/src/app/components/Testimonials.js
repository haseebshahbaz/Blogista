// components/Testimonials.js

const testimonials = [
  {
    name: "Ali Khan",
    feedback: "This blog is my go-to resource for web development tips and tutorials!",
    image: "https://picsum.photos/id/1011/200/200",
  },
  {
    name: "Aisha Malik",
    feedback: "The articles are well-written and informative. Highly recommend!",
    image: "https://picsum.photos/id/1012/200/200",
  },
  {
    name: "Omar Farooq",
    feedback: "I learned so much from this blog! Keep up the great work!",
    image: "https://picsum.photos/id/1013/200/200",
  },
  {
    name: "Fatima Shah",
    feedback: "This blog is a valuable resource for me. Thank you!",
    image: "https://picsum.photos/id/1014/200/200",
  },
  {
    name: "Hassan Raza",
    feedback: "Amazing content! All the material is interesting and useful.",
    image: "https://picsum.photos/id/1015/200/200",
  },
  {
    name: "Sara Ahmed",
    feedback: "The information here is always accurate and up-to-date!",
    image: "https://picsum.photos/id/1016/200/200",
  },
  {
    name: "Bilal Aslam",
    feedback: "I am very impressed with the articles on this blog. Thank you!",
    image: "https://picsum.photos/id/1017/200/200",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <h1 className="text-4xl font-bold text-center text-[#00b4d8] mb-10">What Our Readers Say</h1>
        <div className="overflow-hidden relative">
          <div className="flex animate-slider py-5 px-5 space-x-6">
            {testimonials.concat(testimonials).map((testimonial, index) => (
              <div
                key={index}
                className="bg-white-100 shadow-lg p-6 rounded-lg min-w-[250px] transition-transform duration-300 ease-in-out"
              >
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4"
                />
                <p className="text-gray-700 italic mb-4">"{testimonial.feedback}"</p>
                <h4 className="text-lg font-semibold text-gray-900 text-center">{testimonial.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style js>{`
        .animate-slider {
          animation: scroll 20s linear infinite;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
