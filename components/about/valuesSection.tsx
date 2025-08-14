import { motion } from "framer-motion"
import { CoreValue } from "@/types/about/about"
import { getIconComponent } from "@/lib/icons"

interface ValuesSectionProps {
  title: string
  subtitle: string
  values: CoreValue[]
}

export function ValuesSection({ title, subtitle, values }: ValuesSectionProps) {
  return (
    <section className="py-16 bg-[#0a0a14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => (
            <motion.div
              key={value.id}
              className="bg-[#1a1a2e] rounded-lg p-6 shadow-lg w-full sm:w-80 md:w-80 lg:w-80 flex-shrink-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${value.color}20` }}
              >
                {(() => {
                  const IconComponent = getIconComponent(value.icon_name)
                  return (
                    <IconComponent
                      className="h-6 w-6"
                      style={{ color: value.color }}
                    />
                  )
                })()}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
              <p className="text-gray-300">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}