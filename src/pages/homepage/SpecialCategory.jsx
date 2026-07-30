import React from 'react'

const SpecialCategory = () => {
  return (
    <>
    <section className="py-16 bg-slate-50">
    <div className="max-w-7xl mx-auto px-4">


        <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-light uppercase tracking-wide text-[#2c2c2c] leading-tight">
                Show Someone They Are Special
                <br/>
                Through Personalized Products
            </h2>

            <p className="mt-4 text-gray-500 text-lg">
                Our products come with lots of different options to make your product extra special
            </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

      
            <a href="#" className="group relative overflow-hidden shadow-md">
                <img src="images/wedding.jpg"
                    className="w-full h-56 object-cover group-hover:scale-110 duration-500"/>

                <div className="absolute bottom-0 left-0 w-full bg-black/55 py-4">
                    <h3 className="text-center text-white uppercase tracking-wide text-lg">
                        Wedding/Anniversary
                    </h3>
                </div>
            </a>

            <a href="#" className="group relative overflow-hidden shadow-md">
                <img src="images/housewarming.jpg"
                    className="w-full h-56 object-cover group-hover:scale-110 duration-500"/>

                <div className="absolute bottom-0 left-0 w-full bg-black/55 py-4">
                    <h3 className="text-center text-white uppercase tracking-wide text-lg">
                        Housewarming Products
                    </h3>
                </div>
            </a>

            <a href="#" className="group relative overflow-hidden shadow-md">
                <img src="images/sympathy.jpg"
                    className="w-full h-56 object-cover group-hover:scale-110 duration-500"/>

                <div className="absolute bottom-0 left-0 w-full bg-black/55 py-4">
                    <h3 className="text-center text-white uppercase tracking-wide text-lg">
                        In Sympathy
                    </h3>
                </div>
            </a>

            <a href="#" className="group relative overflow-hidden shadow-md">
                <img src="images/corporate.jpg"
                    className="w-full h-56 object-cover group-hover:scale-110 duration-500"/>

                <div className="absolute bottom-0 left-0 w-full bg-black/55 py-4">
                    <h3 className="text-center text-white uppercase tracking-wide text-lg">
                        Corporate
                    </h3>
                </div>
            </a>

            <a href="#" className="group relative overflow-hidden shadow-md">
                <img src="images/getwell.jpg"
                    className="w-full h-56 object-cover group-hover:scale-110 duration-500"/>

                <div className="absolute bottom-0 left-0 w-full bg-black/55 py-4">
                    <h3 className="text-center text-white uppercase tracking-wide text-lg">
                        Get Well
                    </h3>
                </div>
            </a>

            <a href="#" className="group relative overflow-hidden shadow-md">
                <img src="images/family.jpg"
                    className="w-full h-56 object-cover group-hover:scale-110 duration-500"/>

                <div className="absolute bottom-0 left-0 w-full bg-black/55 py-4">
                    <h3 className="text-center text-white uppercase tracking-wide text-lg">
                        Products For The Family
                    </h3>
                </div>
            </a>

            <a href="#" className="group relative overflow-hidden shadow-md">
                <img src="images/pets.jpg"
                    className="w-full h-56 object-cover group-hover:scale-110 duration-500"/>

                <div className="absolute bottom-0 left-0 w-full bg-black/55 py-4">
                    <h3 className="text-center text-white uppercase tracking-wide text-lg">
                        Products For Pets
                    </h3>
                </div>
            </a>

            <a href="#" className="group relative overflow-hidden shadow-md">
                <img src="images/all.jpg"
                    className="w-full h-56 object-cover group-hover:scale-110 duration-500"/>

                <div className="absolute bottom-0 left-0 w-full bg-black/55 py-4">
                    <h3 className="text-center text-white uppercase tracking-wide text-lg">
                        All
                    </h3>
                </div>
            </a>

        </div>

    </div>
</section>
    
    </>
  )
}

export default SpecialCategory
