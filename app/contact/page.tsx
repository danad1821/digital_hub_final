import ContactForm from "../_components/ContactForm";
import Header from "../_components/Header";

export default function ContactUs() {
  return (
    <>
      <Header />
      <main className=" bg-gray-50 py-12 w-full">
        <div className="custom-container">
          <h1 className="text-4xl sm:text-5xl font-bold my-8 tracking-tight text-center">
            Contact Us
          </h1>
          {/* Flex container for the Contact Form and Contact Details */}
          <section className="flex flex-col md:flex-row gap-12 lg:gap-20 py-8">
            {/* 1. Contact Form (takes full width on small screens, half on medium/large) */}
            <div className="flex-1 min-w-0">
              <ContactForm />
            </div>
            {/* 2. Contact Details (takes full width on small screens, half on medium/large) */}
            <div className="flex-1 min-w-0 space-y-10">
              {/* Alta Maritime - Head Office */}
              <div>
                <h2 className="text-2xl font-semibold mb-3">
                  Alta Maritime - Head Office
                </h2>
                <address className="not-italic text-lg space-y-1">
                  <p>1st floor Yazbeck bldg</p>
                  <p>Ikwan Al Safat street</p>
                  <p>Sioufi, Beirut - 116 5229</p>
                  <p>Lebanon</p>
                </address>
                <div className="mt-4 space-y-1">
                  <p>
                    <strong className="font-medium">phone:</strong>
                    <span className="ml-2">+961 1 397162</span>
                  </p>
                </div>
              </div>
              {/* Alta Maritime - Algeria */}
              <div>
                <h2 className="text-2xl font-semibold mb-3">
                  Alta Maritime - Algeria
                </h2>
                <address className="not-italic text-lg space-y-1">
                  <p>Les freres Khaldi Villa</p>
                  <p>en face L'arc en ciel</p>
                  <p>Local B6 Skikda-BP572</p>
                  <p>Algeria</p>
                </address>
                <div className="mt-4 space-y-1">
                  <p>
                    <strong className="font-medium">phone:</strong>
                    <span className="ml-2">+213 665452699</span>
                  </p>
                  <p>
                    <strong className="font-medium">fax:</strong>
                    <span className="ml-2">+213 38765765</span>
                  </p>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-3">
                  chartering@altamaritime.com
                </h2>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
