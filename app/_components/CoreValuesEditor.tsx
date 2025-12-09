import { v4 as uuidv4 } from 'uuid';


// Assuming the correct path to your types and HomeInfoCard
import { 

    CoreValue, 

    PageSection 
} from '@/app/_types/PageData';

const CoreValuesEditor = ({ sectionIndex, pageData, setPageData }: any) => {
    const coreValuesSection = pageData.sections[sectionIndex] as PageSection<{ 
        title: string;
        intro_text: string;
        values: CoreValue[] 
    }>;
    const coreValuesData = coreValuesSection.data;

    // A utility function to update an item within the 'values' array
    const handleValueItemChange = (valueKey: string, key: keyof CoreValue, value: string) => {
        setPageData((prevData: any) => {
            if (!prevData) return null;
            const newSections = [...prevData.sections];
            
            const newValues = coreValuesData.values.map(val => 
                val.key === valueKey ? { ...val, [key]: value } : val
            );

            newSections[sectionIndex] = { 
                ...coreValuesSection, 
                data: { ...coreValuesData, values: newValues } 
            };
            
            return { ...prevData, sections: newSections };
        });
    };

    // A utility function to add a new Core Value item
    const addCoreValue = () => {
        setPageData((prevData: any) => {
            if (!prevData) return null;
            const newSections = [...prevData.sections];
            const newValue: CoreValue = { key: uuidv4(), icon: "ArrowRight", name: "New Value", description: "Description here." };
            
            newSections[sectionIndex] = {
                ...coreValuesSection,
                data: { ...coreValuesData, values: [...coreValuesData.values, newValue] }
            };
            
            return { ...prevData, sections: newSections };
        });
    };
    
    // A utility function to remove a Core Value item
    const removeCoreValue = (valueKey: string) => {
        setPageData((prevData: any) => {
            if (!prevData) return null;
            const newSections = [...prevData.sections];
            
            const updatedValues = coreValuesData.values.filter(val => val.key !== valueKey);

            newSections[sectionIndex] = {
                ...coreValuesSection,
                data: { ...coreValuesData, values: updatedValues }
            };
            
            return { ...prevData, sections: newSections };
        });
    };

    return (
        <div className='p-4 border border-blue-200 bg-blue-50/50 rounded-lg'>
            <h4 className='text-lg font-semibold mb-3'>Values Editor</h4>
            <button type="button" onClick={addCoreValue} className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors mb-4'>
                + Add New Core Value
            </button>
            
            {coreValuesData.values.map((val: CoreValue) => (
                <div key={val.key} className='border border-gray-300 p-4 mb-4 rounded-sm bg-white shadow-sm'>
                    <div className='flex justify-between items-center mb-2'>
                        <h5 className='text-base font-bold text-gray-800'>{val.name || 'Untitled Value'}</h5>
                        <button type="button" onClick={() => removeCoreValue(val.key)} className='text-red-600 text-sm hover:text-red-800 transition-colors'>
                            Remove
                        </button>
                    </div>
                    <label className='block text-xs font-medium text-gray-500 mt-2'>Name:</label>
                    <input type="text" value={val.name} onChange={(e) => handleValueItemChange(val.key, 'name', e.target.value)} className='w-full p-2 border rounded-sm text-sm' />
                    
                    <label className='block text-xs font-medium text-gray-500 mt-2'>Description:</label>
                    <textarea value={val.description} onChange={(e) => handleValueItemChange(val.key, 'description', e.target.value)} className='w-full p-2 border rounded-sm text-sm min-h-[50px]' />
                    
                    <label className='block text-xs font-medium text-gray-500 mt-2'>Icon Class/Ref:</label>
                    <input type="text" value={val.icon} onChange={(e) => handleValueItemChange(val.key, 'icon', e.target.value)} className='w-full p-2 border rounded-sm text-sm' />
                </div>
            ))}
        </div>
    );
};

export default CoreValuesEditor;