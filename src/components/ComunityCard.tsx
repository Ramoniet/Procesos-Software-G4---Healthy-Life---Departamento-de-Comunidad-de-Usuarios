
export interface ComunityCardProps{
    name:string;
    description:string;
    members:number;
}


export function  ComunityCard({name,description,members}:ComunityCardProps){

    return (
        <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-secondary">{name}</h2>
            <p className="text-sm text-gray-500 flex-1">{description}</p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="bg-primary/10 text-primary font-medium rounded-full px-3 py-1">
                    {members} miembros
                </span>
            </div>
        </div>
    )
}