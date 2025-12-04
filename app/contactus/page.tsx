import ContactForm from "../_components/ContactForm"
export default function ContactUs(){
    return(
        <main>
            <h1 className="text-4xl sm:text-6xl font-bold mb-4 tracking-tight">Contact Us</h1>
            <section>
                <ContactForm/>
            </section>
        </main>
    )
}