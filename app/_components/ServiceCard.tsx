export default function ServiceCard({service}: any){
    return(
        <div className="bg-[#0A1C30] text-white rounded-xl service-card">
            <h3 className="text-lg text-center">{service.category}</h3>
            <p>{service.description}</p>
            <button className="text-center">Know more</button>
        </div>
    )
}