"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAddress } from "../../../context/AddressContext";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export default function AddressPage() {
  const router = useRouter();
  const { setAddressData } = useAddress();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
    additionalInfo: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "firstName":
        if (!value.trim()) return "First name is required";
        if (value.trim().length < 2)
          return "First name must be at least 2 characters";
        if (!/^[a-zA-Z\s\u00C0-\u017F]+$/.test(value))
          return "First name can only contain letters";
        return undefined;

      case "lastName":
        if (!value.trim()) return "Last name is required";
        if (value.trim().length < 2)
          return "Last name must be at least 2 characters";
        if (!/^[a-zA-Z\s\u00C0-\u017F]+$/.test(value))
          return "Last name can only contain letters";
        return undefined;

      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Please enter a valid email address";
        return undefined;

      case "phone":
        if (!value.trim()) return "Phone number is required";
        const phoneDigits = value.replace(/\D/g, "");
        if (phoneDigits.length < 9)
          return "Phone number must be at least 9 digits";
        if (phoneDigits.length > 15) return "Phone number is too long";
        return undefined;

      case "street":
        if (!value.trim()) return "Street address is required";
        if (value.trim().length < 5)
          return "Street address must be at least 5 characters";
        return undefined;

      case "city":
        if (!value.trim()) return "City is required";
        if (value.trim().length < 2)
          return "City name must be at least 2 characters";
        if (!/^[a-zA-Z\s\u00C0-\u017F-]+$/.test(value))
          return "City name can only contain letters";
        return undefined;

      case "postalCode":
        if (!value.trim()) return "Postal code is required";
        if (!/^[0-9A-Z\s-]+$/.test(value))
          return "Please enter a valid postal code";
        if (value.trim().length < 3) return "Postal code is too short";
        return undefined;

      case "country":
        if (!value.trim()) return "Country is required";
        if (value.trim().length < 2)
          return "Country name must be at least 2 characters";
        return undefined;

      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (key !== "additionalInfo") {
        const error = validateField(
          key,
          formData[key as keyof typeof formData]
        );
        if (error) {
          newErrors[key as keyof FormErrors] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate field on change if it has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as { [key: string]: boolean });
    setTouched(allTouched);

    // Validate entire form
    if (validateForm()) {
      setAddressData(formData);
      console.log("Form submitted:", formData);
      router.push("/checkout");
    } else {
      console.log("Form has errors");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Delivery Address</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium mb-1"
              >
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.firstName && touched.firstName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.firstName && touched.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium mb-1"
              >
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.lastName && touched.lastName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.lastName && touched.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email && touched.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phone && touched.phone
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.phone && touched.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Delivery Address</h2>

          <div>
            <label htmlFor="street" className="block text-sm font-medium mb-1">
              Street Address *
            </label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.street && touched.street
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {errors.street && touched.street && (
              <p className="text-red-500 text-sm mt-1">{errors.street}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-1">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.city && touched.city
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.city && touched.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="postalCode"
                className="block text-sm font-medium mb-1"
              >
                Postal Code *
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.postalCode && touched.postalCode
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.postalCode && touched.postalCode && (
                <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium mb-1"
              >
                Country *
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.country && touched.country
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.country && touched.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="additionalInfo"
              className="block text-sm font-medium mb-1"
            >
              Additional Information (Optional)
            </label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              rows={3}
              placeholder="Apartment number, delivery instructions, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 px-6 rounded-md font-semibold hover:bg-orange-600 transition-colors"
        >
          Continue to Checkout
        </button>
      </form>
    </div>
  );
}
