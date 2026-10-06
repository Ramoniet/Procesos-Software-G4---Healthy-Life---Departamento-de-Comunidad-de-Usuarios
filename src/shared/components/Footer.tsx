export function Footer() {
  const campuses = [
    { name: 'Campus de Móstoles', address: 'C/ Tulipán, s/n, 28933 Móstoles, Madrid' },
    { name: 'Campus de Alcorcón', address: 'Av. de Atenas, s/n, 28922 Alcorcón, Madrid' },
    { name: 'Campus de Fuenlabrada', address: 'Camino del Molino, 5, 28943 Fuenlabrada, Madrid' },
    { name: 'Campus de Vicálvaro', address: 'P.º de los Artilleros, s/n, 28032 Madrid' },
    { name: 'Campus de Madrid (Quintana)', address: 'C/ Quintana, 21, 28008 Madrid' },
  ];

  return (
    <footer className="bg-secondary text-white mt-auto">
      <div className="p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Info URJC */}
          <div className="flex flex-col gap-2 md:w-1/3">
            <h3 className="text-lg font-semibold">Universidad Rey Juan Carlos</h3>
            <p className="text-sm text-gray-300">
              Universidad pública de la Comunidad de Madrid, fundada en 1996.
            </p>
            <p className="text-sm text-gray-300">Tel: +34 91 488 93 93</p>
            <p className="text-sm text-gray-300">info@urjc.es</p>
          </div>

          {/* Campus */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-3">Campus</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {campuses.map((campus) => (
                <div key={campus.name}>
                  <p className="text-sm font-medium">{campus.name}</p>
                  <p className="text-xs text-gray-400">{campus.address}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-white/10 px-8 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Universidad Rey Juan Carlos. Todos los derechos reservados.
      </div>
    </footer>
  );
}
