import React from "react";

const Contact = () => {
  return (
    <div className="mb-4">
      <h3 className="text-2xl sm:text-3xl font-bold text-orange-700 text-center my-6">
        Contact
      </h3>
      <div className="border-2 border-orange-200 rounded-xl p-4 sm:p-6 md:p-8 shadow-lg bg-gradient-to-br from-white to-orange-50">
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-orange-600 mb-3">
              Location
            </h4>
            <p className="text-gray-700 mb-2 text-sm sm:text-base">
              123 Pizza Street
            </p>
            <p className="text-gray-700 mb-2 text-sm sm:text-base">
              New York, NY 10001
            </p>
            <p className="text-gray-700 text-sm sm:text-base">United States</p>
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-orange-600 mb-3">
              Get in Touch
            </h4>
            <p className="text-gray-700 mb-2 text-sm sm:text-base">
              <span className="font-semibold">Phone:</span> +1 (555) 123-4567
            </p>
            <p className="text-gray-700 mb-2 text-sm sm:text-base break-words">
              <span className="font-semibold">Email:</span> info@nextpizza.com
            </p>
            <p className="text-gray-700 text-sm sm:text-base">
              <span className="font-semibold">Hours:</span> Mon-Sun 11:00 AM -
              11:00 PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
