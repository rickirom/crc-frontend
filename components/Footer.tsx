export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-gray-800 mt-15">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="font-mono text-xs text-gray-600">
          © {new Date().getFullYear()} Ricardo Romero
        </p>
        <p className="font-mono text-xs text-gray-700">
          built with ♥ by R2
        </p>
      </div>
    </footer>
  )
}
