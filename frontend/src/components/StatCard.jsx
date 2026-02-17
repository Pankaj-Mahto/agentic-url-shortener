import { motion } from "framer-motion";

export default function StatCard({ icon, title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white p-6 rounded-2xl shadow"
    >

      <div className="flex items-center gap-4">

        <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
          {icon}
        </div>

        <div>
          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <p className="text-2xl font-bold">
            {value}
          </p>
        </div>

      </div>

    </motion.div>
  );
}
