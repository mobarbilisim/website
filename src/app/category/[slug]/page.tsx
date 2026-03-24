export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const formattedTitle = slug.replace(/-/g, ' ').toUpperCase();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center min-h-[50vh]">
      <h1 className="text-3xl md:text-5xl font-extrabold mb-6">
        Kategori: <span className="text-blue-600">{formattedTitle}</span>
      </h1>
      <p className="text-gray-500 mb-12">
        Bu alana seçtiğiniz alt kategoriye ait özel ürünlerin listesi ({slug}) veritabanından çekilip gelecektir.
      </p>
    </div>
  );
}
