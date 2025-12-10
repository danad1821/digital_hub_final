"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect, useCallback, useMemo } from 'react';
import { Truck, Package, Mail, Loader, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

// --- 1. Define Interfaces ---

/** Defines the structure of a Destination (matching destinationSchema). */
interface Destination {
    name: string;
    lat: number;
    lng: number;
}

/** Defines the structure of a Location (matching locationSchema). */
interface Location {
    name: string; // The official name of the port or hub
    address: string;
    lat: number;
    lng: number;
    destinations: Destination[]; // The ports it can ship to
}

/** Defines the structure of the dimensions object. */
interface Dimensions {
    length: string | number;
    width: string | number;
    height: string | number;
}

/** Defines the overall shape of the form data state. */
interface FormData {
    origin: string;
    destination: string;
    mode: 'Ocean Freight'; 
    readyDate: string;
    weight: string | number;
    dimensions: Dimensions;
    pieces: number;
    name: string;
    email: string;
    phone: string;
    notes: string;
}

// --- 2. Initial State and Constants ---

const initialFormData: FormData = {
    origin: '',
    destination: '',
    mode: 'Ocean Freight', 
    readyDate: '',
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    pieces: 1,
    name: '',
    email: '',
    phone: '',
    notes: '',
};

// Define colors
const ACCENT_COLOR = 'ring-[#00FFFF]';
const BUTTON_COLOR = 'bg-[#00FFFF]';
const BUTTON_TEXT_COLOR = 'text-[#0A1C30]';
const TEXT_FOCUS_COLOR = 'focus:border-[#00FFFF]';

// --- 3. Main Component ---

export default function QuoteForm() {
    const [step, setStep] = useState<number>(1);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [loading, setLoading] = useState<boolean>(false);
    const [quoteResult, setQuoteResult] = useState<string | null>(null);
    const [globalError, setGlobalError] = useState<string>(''); 
    const [status, setStatus] = useState<string>("idle");
    
    const [originLocations, setOriginLocations] = useState<Location[]>([]);
    const [endDestinations, setEndDestinations] = useState<Destination[]>([]);

    // --- Data Fetching and Dependency Logic (useCallback) ---

    const fetchAllLocations = useCallback(async () => {
        setGlobalError('');
        try {
            const response = await axios.get<Location[]>('/api/locations'); 
            setOriginLocations(response.data);
        } catch (error) {
            console.error("Error fetching locations:", error);
            setGlobalError("Could not load shipping port data. Please ensure the API is running.");
        }
    }, []);

    const updateDestinations = useCallback((selectedOriginName: string) => {
        const currentOrigin = originLocations.find(l => l.name === selectedOriginName);
        
        if (currentOrigin) {
            setEndDestinations(currentOrigin.destinations);
        } else {
            setEndDestinations([]);
        }

        setFormData(prevData => ({ ...prevData, destination: '' }));
    }, [originLocations]);

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (globalError) setGlobalError('');

        if (name.startsWith('dim_')) {
            const dimKey = name.split('_')[1] as keyof Dimensions;
            setFormData(prevData => ({
                ...prevData,
                dimensions: {
                    ...prevData.dimensions,
                    [dimKey]: value,
                },
            }));
        } else if (name === 'pieces' || name === 'weight' || name.startsWith('dim_')) {
            if (value === '') {
                 setFormData(prevData => ({ ...prevData, [name]: '' }));
                 return;
            }
            const numValue = parseFloat(value);
            if (!isNaN(numValue) || value === '') {
                setFormData(prevData => ({ 
                    ...prevData, 
                    [name]: value
                }));
            }
        } else {
            setFormData(prevData => ({ ...prevData, [name]: value }));

            if (name === 'origin') {
                updateDestinations(value);
            }
        }
    }, [globalError, updateDestinations]);

    const validateStep = useCallback((): boolean => {
        let isValid: boolean = true;
        let errorMessage: string = '';

        switch (step) {
            case 1:
                if (!formData.origin || !formData.destination || !formData.mode) {
                    isValid = false;
                    errorMessage = "Please select both origin and destination ports.";
                }
                break;
            case 2:
                const { weight, pieces, dimensions } = formData;
                if (
                    !weight || 
                    Number(weight) <= 0 ||
                    !pieces ||
                    Number(pieces) <= 0 ||
                    !dimensions.length ||
                    Number(dimensions.length) <= 0 ||
                    !dimensions.width ||
                    Number(dimensions.width) <= 0 ||
                    !dimensions.height ||
                    Number(dimensions.height) <= 0
                ) {
                    isValid = false;
                    errorMessage = "Please enter valid, positive values for all cargo details (Weight, Pieces, and all Dimensions).";
                }
                break;
            case 3:
                if (!formData.name.trim() || !formData.email.trim()) {
                    isValid = false;
                    errorMessage = "Please enter your name and email address.";
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                        isValid = false;
                        errorMessage = "Please enter a valid email address.";
                }
                break;
            default:
                break;
        }
        
        if (!isValid) {
            setGlobalError(errorMessage);
        } else {
            setGlobalError('');
        }

        return isValid;
    }, [step, formData]);

    const handleNext = useCallback(() => {
        if (validateStep()) {
            setStep(prevStep => prevStep + 1);
        }
    }, [validateStep]);

    const handleBack = useCallback(() => {
        setStep(prevStep => prevStep - 1);
        setGlobalError('');
    }, []);

    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setGlobalError('');

        if (!validateStep()) {
            setStatus("idle");
            return;
        }

        setStatus("loading");
        setLoading(true);

        try {
            // Mock API Response for Demo
            await new Promise(resolve => setTimeout(resolve, 1500));
            const mockQuote = `$${(Math.random() * 5000 + 1000).toFixed(2)}`;
            setQuoteResult(mockQuote);
            setStep(4);
            setStatus("success");
        } catch (error) {
            setGlobalError("An unexpected error occurred while fetching the quote.");
            console.error("Submission Error:", error);
            setStatus("error");
        } finally {
            setLoading(false);
        }
    }, [validateStep, formData]);

    // --- Memoization (useMemo) for Options Rendering ---
    
    const memoizedOriginOptions = useMemo(() => {
        return originLocations.map((loc) => (
            <option key={loc.name} value={loc.name}>
                {loc.name}
            </option>
        ));
    }, [originLocations]);

    const memoizedDestinationOptions = useMemo(() => {
        return endDestinations.map((loc) => (
            <option key={loc.name} value={loc.name}>
                {loc.name}
            </option>
        ));
    }, [endDestinations]);

    // --- Data Fetching Effect ---

    useEffect(() => {
        fetchAllLocations();
    }, [fetchAllLocations]);

    // --- Reusable Render Functions ---

    const renderSelect = (
        label: string,
        name: keyof FormData,
        placeholder: string,
        required: boolean = true,
        icon: React.ReactNode,
        value: string,
        memoizedOptions: React.ReactNode[],
        isDisabled: boolean = false,
        optionsLength: number
    ) => (
        <div className="relative mb-6">
            <label htmlFor={name} className="text-sm font-medium text-gray-700 block mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className={`flex items-center bg-white rounded-sm border border-gray-300 focus-within:ring-2 ${ACCENT_COLOR}`}>
                <div className="pl-3 pr-2 text-gray-400">{icon}</div>
                <select
                    name={name}
                    value={value}
                    onChange={handleChange}
                    required={required}
                    disabled={isDisabled || optionsLength === 0} 
                    className={`flex-1 p-3 bg-transparent outline-none text-gray-800 placeholder-gray-500 rounded-sm appearance-none cursor-pointer ${TEXT_FOCUS_COLOR} ${isDisabled || optionsLength === 0 ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : ''}`}
                >
                    <option value="" disabled>{placeholder}</option>
                    {memoizedOptions}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
            {name === 'destination' && (!formData.origin || (formData.origin && optionsLength === 0)) && (
                <p className="mt-1 text-xs text-red-500">
                    { !formData.origin ? "Please select an Origin Port first." : "No routes defined from the selected Origin Port."}
                </p>
            )}
        </div>
    );
    
    const renderInput = (
        label: string,
        name: keyof FormData | `dim_${keyof Dimensions}`,
        type: string = "text",
        placeholder: string = label,
        required: boolean = true,
        icon: React.ReactNode,
        value: string | number
    ) => (
        <div className="relative mb-6">
            <label htmlFor={name} className="text-sm font-medium text-gray-700 block mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className={`flex items-center bg-white rounded-sm border border-gray-300 focus-within:ring-2 ${ACCENT_COLOR}`}>
                <div className="pl-3 pr-2 text-gray-400">{icon}</div>
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required={required}
                    className={`flex-1 p-3 bg-transparent outline-none text-gray-800 placeholder-gray-500 rounded-sm ${TEXT_FOCUS_COLOR}`}
                />
            </div>
        </div>
    );

    // --- Rendering Functions for Each Step ---

    const renderStep1 = () => (
        <div className="form-step step-1">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-[#0A1C30]">
                <Truck className="w-6 h-6 mr-2 text-[#00FFFF]" />
                1. Shipment Details
            </h3>
            
            {renderSelect(
                "Shipping From (Origin Port)", 
                "origin", 
                originLocations.length > 0 ? "Select Origin Port" : "Loading Ports...", 
                true, 
                <Truck className="w-4 h-4" />, 
                formData.origin,
                memoizedOriginOptions,
                false,
                originLocations.length
            )}
            
            {renderSelect(
                "Shipping To (Destination Port)", 
                "destination", 
                formData.origin ? "Select Destination Port" : "Select an Origin Port first", 
                true, 
                <Truck className="w-4 h-4 transform scale-x-[-1]" />, 
                formData.destination,
                memoizedDestinationOptions,
                !formData.origin || endDestinations.length === 0,
                endDestinations.length
            )}
            
            <div className="relative mb-6">
                <label htmlFor="mode" className="text-sm font-medium text-gray-700 block mb-1">
                    Mode of Transport <span className="text-red-500">*</span>
                </label>
                <div className={`flex items-center bg-gray-100 rounded-sm border border-gray-300`}>
                    <div className="pl-3 pr-2 text-gray-400"><Truck className="w-4 h-4" /></div>
                    <input 
                        name="mode" 
                        value={formData.mode} 
                        readOnly 
                        disabled
                        className="flex-1 p-3 bg-transparent outline-none text-gray-600 rounded-sm cursor-not-allowed"
                    />
                    <div className="pr-3 text-sm text-[#0A1C30] font-semibold">Ocean Only</div>
                </div>
            </div>
            
            {renderInput("Ready Date", "readyDate", "date", "", false, null, formData.readyDate)}
            
            <div className="flex justify-end pt-4">
                <button type="button" onClick={handleNext} className={`px-6 py-3 border border-transparent text-base font-medium rounded-sm ${BUTTON_TEXT_COLOR} ${BUTTON_COLOR} hover:${BUTTON_COLOR}/50 transition duration-300 shadow-md`}>
                    Next: Cargo Details
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="form-step step-2">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-[#0A1C30]">
                <Package className="w-6 h-6 mr-2 text-[#00FFFF]" />
                2. Cargo Details
            </h3>
            
            {renderInput("Total Weight (kg)", "weight", "number", "e.g., 500", true, <span className="text-xs font-bold">KG</span>, formData.weight)}
            
            {renderInput("Number of Pieces/Pallets", "pieces", "number", "e.g., 10", true, <span className="text-xs font-bold">#</span>, formData.pieces)}
            
            <label className="text-sm font-medium text-gray-700 block mb-1">
                Dimensions (L x W x H) in cm <span className="text-red-500">*</span>
            </label>
            <div className="dimensions-group flex space-x-2 mb-6">
                {renderInput("Length", "dim_length", "number", "Length (cm)", true, <span className="text-xs font-bold">L</span>, formData.dimensions.length)}
                {renderInput("Width", "dim_width", "number", "Width (cm)", true, <span className="text-xs font-bold">W</span>, formData.dimensions.width)}
                {renderInput("Height", "dim_height", "number", "Height (cm)", true, <span className="text-xs font-bold">H</span>, formData.dimensions.height)}
            </div>
            
            <div className="flex justify-between pt-4">
                <button type="button" onClick={handleBack} className="px-6 py-3 border border-gray-300 text-base font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 transition duration-300">
                    Back
                </button>
                <button type="button" onClick={handleNext} className={`px-6 py-3 border border-transparent text-base font-medium rounded-sm ${BUTTON_TEXT_COLOR} ${BUTTON_COLOR} hover:${BUTTON_COLOR}/50 transition duration-300 shadow-md`}>
                    Next: Contact Info
                </button>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="form-step step-3">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-[#0A1C30]">
                <Mail className="w-6 h-6 mr-2 text-[#00FFFF]" />
                3. Contact Information
            </h3>
            
            {renderInput("Your Name", "name", "text", "Jane Doe", true, <Mail className="w-4 h-4" />, formData.name)}
            {renderInput("Email Address", "email", "email", "jane.doe@example.com", true, <Mail className="w-4 h-4" />, formData.email)}
            {renderInput("Phone Number (Optional)", "phone", "tel", "+1 555 123 4567", false, <Mail className="w-4 h-4" />, formData.phone)}
            
            <div className="relative mb-6">
                <label htmlFor="notes" className="text-sm font-medium text-gray-700 block mb-1">
                    Special Instructions/Notes
                </label>
                <div className={`flex bg-white rounded-sm border border-gray-300 focus-within:ring-2 ${ACCENT_COLOR}`}>
                    <textarea 
                        name="notes" 
                        id="notes"
                        value={formData.notes} 
                        onChange={handleChange} 
                        rows={4}
                        placeholder="Any special handling or requirements..."
                        className={`flex-1 p-3 bg-transparent outline-none text-gray-800 placeholder-gray-500 rounded-sm resize-none ${TEXT_FOCUS_COLOR}`}
                    ></textarea>
                </div>
            </div>
            
            <div className="flex justify-between pt-4">
                <button type="button" onClick={handleBack} className="px-6 py-3 border border-gray-300 text-base font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 transition duration-300">
                    Back
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-1/2 flex items-center justify-center px-6 py-3 border cursor-pointer border-transparent text-base font-medium rounded-sm ${BUTTON_TEXT_COLOR} ${BUTTON_COLOR} hover:${BUTTON_COLOR}/50 transition duration-300 shadow-md disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                    {loading ? (
                        <>
                            <Loader className="w-5 h-5 mr-2 animate-spin" />
                            Calculating...
                        </>
                    ) : (
                        <>
                            <Truck className="w-5 h-5 mr-2" />
                            Get My Quote
                        </>
                    )}
                </button>
            </div>
        </div>
    );
    
    const renderResult = () => (
        <div className="quote-result p-6 bg-green-50 border border-green-300 rounded-lg text-center">
            <CheckCircle className="w-12 h-12 mx-auto text-green-600 mb-3" />
            <h3 className="text-2xl font-bold mb-2 text-green-800">Quote Calculated Successfully!</h3>
            <p className="mb-4 text-green-700">Based on your shipment details:</p>
            
            <div className="quote-display bg-white p-4 inline-block rounded-md shadow-inner mb-6">
                <strong className="text-3xl font-extrabold text-[#0A1C30]">{quoteResult} USD</strong>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">A detailed quote has been sent to **{formData.email}**. Check your spam folder if you don't see it immediately.</p>
            
            <button 
                type="button" 
                onClick={() => { setStep(1); setFormData(initialFormData); setQuoteResult(null); setStatus("idle"); }}
                className="px-6 py-3 border border-gray-300 text-base font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-100 transition duration-300"
            >
                Start a New Quote
            </button>
        </div>
    );

    // --- Main Render ---

    return (
        <div className="bg-white rounded-sm my-4 min-w-[45%] p-6 shadow-xl">
            <form onSubmit={handleSubmit} className="quote-form-container space-y-6">
                
                {/* Progress Bar (Styled as Steps) */}
                <div className="progress-bar flex justify-between text-center mb-8">
                    {[1, 2, 3, 4].map(s => (
                        <div key={s} className="flex-1">
                            <span 
                                className={`block w-8 h-8 mx-auto mb-1 rounded-full text-white font-bold flex items-center justify-center text-sm 
                                    ${step >= s ? 'bg-[#00FFFF] text-[#0A1C30]' : 'bg-gray-300 text-gray-600'}`}
                            >
                                {s}
                            </span>
                            <span className={`text-xs font-medium ${step >= s ? 'text-[#0A1C30]' : 'text-gray-500'}`}>
                                {s === 1 ? 'Shipment' : s === 2 ? 'Cargo' : s === 3 ? 'Contact' : 'Result'}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Status/Error Messages */}
                {(globalError) && (
                    <div className="flex items-center p-3 text-sm text-red-700 bg-red-100 rounded-lg">
                        <XCircle className="w-5 h-5 mr-2" />
                        <span>{globalError}</span>
                    </div>
                )}
                {status === "error" && !globalError && (
                    <div className="flex items-center p-3 text-sm text-red-700 bg-red-100 rounded-lg">
                        <XCircle className="w-5 h-5 mr-2" />
                        <span>Submission failed due to a server error.</span>
                    </div>
                )}
                
                {/* Step Content */}
                <div className="current-step-content">
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderResult()}
                </div>
                
            </form>
        </div>
    );
}