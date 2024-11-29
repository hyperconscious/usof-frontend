import React from 'react';

interface InputFieldProps {
  label: string;
  type: string;
  register: ReturnType<any>;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  register,
  error,
}) => {
  return (
    <div className="flex flex-col mb-4 w-full">
      <label className="block text-gray-700 font-semibold mb-2">{label}</label>
      <input
        type={type}
        {...register}
        className={`p-2 rounded-lg min-w-72 focus:outline-none border ${error ? 'border-red-400' : 'border-gray-300'
          }`}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
