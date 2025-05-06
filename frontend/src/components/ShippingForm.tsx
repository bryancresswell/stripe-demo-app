import React, { useState, useEffect } from 'react'
import { TruckIcon } from 'lucide-react'


export const ShippingForm = ({
    currentStep,
    shippingInfo,
    setShippingInfo,
    selectedCountry,
    setSelectedCountry,
    selectedCurrency,
    setSelectedCurrency
}: {
    selectedCurrency: string;
    currentStep: 'shipping' | 'payment';
    shippingInfo: {
        firstName: string;
        lastName: string;
        address: string;
        country: string;
        city: string;
        state: string;
        zipCode: string;
        email: string;
        phone: string;
    };
    setShippingInfo: React.Dispatch<React.SetStateAction<{
        firstName: string;
        lastName: string;
        address: string;
        country: string;
        city: string;
        state: string;
        zipCode: string;
        email: string;
        phone: string;
    }>>;
    selectedCountry: string;
    setSelectedCountry: React.Dispatch<React.SetStateAction<string>>;
    setSelectedCurrency: React.Dispatch<React.SetStateAction<string>>;
}) => {

    const countries = [
        {
            value: 'SG',
            label: 'Singapore',
            currency: 'SGD'
        },
        {
            value: 'US',
            label: 'United States',
            currency: 'USD'
        },
        {
            value: 'CA',
            label: 'Canada',
            currency: 'CAD'
        },
        {
            value: 'AU',
            label: 'Australia',
            currency: 'AUD'
        }
    ]

    const COUNTRIES_WITH_STATES = ['US', 'CA', 'AU']

    const requiresState = COUNTRIES_WITH_STATES.includes(selectedCountry)

    const autofillShippingData = () => {
        setSelectedCountry("SG");
        setSelectedCurrency("SGD");
        setShippingInfo({
            firstName: "John",
            lastName: "Doe",
            address: "123 Main St",
            city: "Singapore",
            state: requiresState ? "CA" : "",
            zipCode: "123456",
            country: selectedCountry || "SG",
            phone: "+65 9123 4567",
            email: "john.doe@example.com"
        });
    }

    return (
        <div>
            <div className="flex-1 space-y-8">
                <div
                    className={`border border-gray-300 rounded-md p-4 ${currentStep === 'payment' ? 'opacity-50' : ''}`}
                >
                    <div className='flex'>
                        <h2 className="font-bold mb-4 flex items-center flex-grow whitespace-nowrap">
                            <TruckIcon className="h-5 w-5 mr-2" />
                            Shipping Information
                        </h2>
                        <div className="flex items-center justify-between w-full">
                            <div></div>
                            <button disabled={currentStep === 'payment'} className="flex text-white py-1 px-2 items-center ml-auto" onClick={() => autofillShippingData()}>Auto-fill</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                First Name
                            </label>
                            <input
                                type="text"
                                required
                                disabled={currentStep === 'payment'}
                                className="w-full border border-gray-300 rounded-md p-2"
                                value={shippingInfo.firstName}
                                onChange={(e) =>
                                    setShippingInfo({
                                        ...shippingInfo,
                                        firstName: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Last Name
                            </label>
                            <input
                                type="text"
                                required
                                disabled={currentStep === 'payment'}
                                className="w-full border border-gray-300 rounded-md p-2"
                                value={shippingInfo.lastName}
                                onChange={(e) =>
                                    setShippingInfo({
                                        ...shippingInfo,
                                        lastName: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">
                                Address
                            </label>
                            <input
                                type="text"
                                required
                                disabled={currentStep === 'payment'}
                                className="w-full border border-gray-300 rounded-md p-2"
                                value={shippingInfo.address}
                                onChange={(e) =>
                                    setShippingInfo({
                                        ...shippingInfo,
                                        address: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">
                                Country
                            </label>
                            {countries && countries.length > 0 && (
                                <select
                                    value={shippingInfo.country}
                                    onChange={(e) => {
                                        setShippingInfo({
                                            ...shippingInfo,
                                            country: e.target.value,
                                            state: ''
                                        });
                                        setSelectedCountry(e.target.value);
                                        const selectedOption = e.target.options[e.target.selectedIndex];
                                        const currency = selectedOption.getAttribute('data-attr-currency') || '';
                                        setSelectedCurrency(currency);
                                    }}
                                    disabled={currentStep === 'payment'}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                >
                                    <option value="" disabled>
                                        Select a country
                                    </option>
                                    {countries.map((country: { value: string; label: string; currency: string }) => (
                                        <option key={country.value} value={country.value} data-attr-currency={country.currency}>
                                            {country.label}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">City</label>
                            <input
                                type="text"
                                required
                                disabled={currentStep === 'payment'}
                                className="w-full border border-gray-300 rounded-md p-2"
                                value={shippingInfo.city}
                                onChange={(e) =>
                                    setShippingInfo({
                                        ...shippingInfo,
                                        city: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div hidden={!requiresState}>
                                <label className="block text-sm font-medium mb-1">
                                    State
                                </label>
                                <input
                                    type="text"
                                    required={requiresState}
                                    disabled={currentStep === 'payment' || !requiresState}
                                    className={
                                        `w-full border border-gray-300 rounded-md p-2 ${requiresState ? '' : 'opacity-50'} ` +
                                        (
                                            requiresState && !shippingInfo.state && currentStep !== 'payment'
                                                ? 'border-red-500 ring-2 ring-red-400'
                                                : ''
                                        )
                                    }
                                    value={shippingInfo.state}
                                    onChange={(e) =>
                                        setShippingInfo({
                                            ...shippingInfo,
                                            state: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Zip Code
                                </label>
                                <input
                                    type="text"
                                    required
                                    disabled={currentStep === 'payment'}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    value={shippingInfo.zipCode}
                                    onChange={(e) =>
                                        setShippingInfo({
                                            ...shippingInfo,
                                            zipCode: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                disabled={currentStep === 'payment'}
                                className="w-full border border-gray-300 rounded-md p-2"
                                value={shippingInfo.email}
                                onChange={(e) =>
                                    setShippingInfo({
                                        ...shippingInfo,
                                        email: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Phone
                            </label>
                            <input
                                type="tel"
                                required
                                disabled={currentStep === 'payment'}
                                className="w-full border border-gray-300 rounded-md p-2"
                                value={shippingInfo.phone}
                                onChange={(e) =>
                                    setShippingInfo({
                                        ...shippingInfo,
                                        phone: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}