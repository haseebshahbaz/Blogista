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
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">What Our Readers Say</h2>
        <div className="overflow-hidden">
          <div className="flex animate-slider space-x-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-100 shadow-lg p-6 rounded-lg min-w-[250px]"
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
    </section>
  );
}
