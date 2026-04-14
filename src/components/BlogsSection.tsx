import { motion } from 'framer-motion'

const blogs = [
  {
    title: 'GitHub new space shooter README Step-by-Step Guide',
    excerpt: 'This step-by-step guide shows how to create a GitHub Space Shooter README using GitHub Actions. By setting up a workflow, you can automatically generate and update a Space Shooter GIF in your repository, making your GitHub profile more interactive and visually engaging.',
    meta: 'Tutorial · 2 min read',
    href: 'https://dev.to/snackoverflowwithasad/github-new-space-shooter-readme-step-by-step-guide-2m9b',
  },
//   {
//     title: 'Hey there, do you know me?',
//     excerpt: 'This blog explores how strategic laziness can make you a better developer. By automating repetitive tasks and building small personal tools, I turned everyday frustrations into learning opportunities, improving my skills while creating practical and fun projects along the way.',
//     meta: 'Introduction · 1 min read',
//     href: 'https://dev.to/snackoverflowwithasad/how-being-lazy-made-me-a-better-developer-398h',
//   },
  {
    title: 'How being lazy made me a better developer',
    excerpt: 'Sometimes laziness leads to creativity. In this blog, I share how avoiding repetitive tasks motivated me to build small projects like a currency converter and fun experimental tools. These simple ideas helped me learn APIs, improve development skills, and turn boring moments into productive learning opportunities.',
    meta: 'Lazy · 2 min read',
    href: 'https://dev.to/snackoverflowwithasad/how-being-lazy-made-me-a-better-developer-1cd0',
  },
  {
    title: 'Why NumPy and Pandas are Essential: A Beginner’s Realization in AI/ML',
    excerpt: 'Starting my AI/ML journey made me realize how important NumPy and Pandas really are. NumPy helps with fast numerical computations, while Pandas makes data cleaning, transformation, and analysis much easier. Together, they form the foundation for building effective machine learning models and working with real-world data.',
    meta: 'AI/ML · 2 min read',
    href: 'https://dev.to/snackoverflowwithasad/why-numpy-and-pandas-are-essential-a-beginners-realization-in-aiml-959',
  },
]

function BlogsSection() {
  return (
    <motion.section
      data-blogs
      className="border-t-2 border-[#111111] px-4 pb-6 pt-6 sm:px-5 lg:px-9 lg:pb-10 lg:pt-[34px]"
      id="blog"
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65 }}
      viewport={{ once: true, amount: 0.25 }}
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <h2 className="mb-6 font-['Syne'] text-[clamp(26px,7vw,48px)] leading-[1.05] tracking-[-0.03em] sm:mb-[30px]">
          My{' '}
          <span className="relative inline-block px-1.5">
            <span
              className="absolute inset-0 -rotate-[2deg] bg-[#9dff00]/70 opacity-65 [clip-path:polygon(8%_18%,20%_6%,42%_10%,63%_4%,84%_14%,95%_34%,92%_58%,97%_79%,83%_93%,60%_88%,39%_96%,18%_88%,7%_68%,4%_45%)]"
              aria-hidden="true"
            />
            <span className="relative">Blogs</span>
          </span>
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {blogs.map((blog) => (
            <article
              key={blog.title}
              className="group border-2 border-[#111111] bg-[#f6f6f3] p-5 shadow-[5px_5px_0_#9f9f9f] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f2f2ea] hover:shadow-[8px_8px_0_#111111]"
            >
              <p className="mb-3 font-['Syne'] text-xs font-bold uppercase tracking-[0.14em] text-[#3e3e3e]">
                {blog.meta}
              </p>
              <h3 className="mb-3 font-['Syne'] text-[clamp(24px,3.2vw,34px)] leading-[1.05] text-[#151515]">
                {blog.title}
              </h3>
              <p className="mb-5 text-[16px] leading-[1.45] text-[#3f3f3f]">{blog.excerpt}</p>
              <a
                href={blog.href}
                className="inline-flex items-center gap-2 border-2 border-[#111111] bg-[#111111] px-3 py-1.5 font-['Syne'] text-xs font-bold uppercase tracking-[0.1em] text-white no-underline transition-all duration-200 group-hover:bg-[#9dff00] group-hover:text-[#111111]"
              >
                Read More <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default BlogsSection
