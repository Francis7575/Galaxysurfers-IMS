import  Heading  from "@/components/common/Heading";
import { NewItem } from "@/types/types";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ItemType } from "@/types/typesBackend";
import { toast } from "react-toastify";

// Function to handle file upload to Cloudinary
const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "hdim8qpe");
  // console.log(file)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/dlknx4y4m/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );
  // console.log(response)
  if (response.ok) {
    const data = await response.json();
    return data.secure_url;
  } else {
    throw new Error("Failed to upload image to Cloudinary");
  }
};

const EditItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state as ItemType;
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const initialValues: NewItem = {
    productCode: item.code_item,
    itemName: item.name_item,
    itemUnit: item.idunit_item,
    itemDescription: item.description_item,
    itemUrl: item.imgurl_item,
    itemBatch: item.batch_ctrl_item == 1 ? "Yes" : "No",
    Expiration: item.expiration_ctrl_item == 1 ? "Yes" : "No",
  };
  const validationSchema = Yup.object({
    productCode: Yup.string().required("Product Code is required"),
    itemName: Yup.string().required("Item Name is required"),
    itemDescription: Yup.string().required("Item Description is required"),
  });
  const InputFields = [
    {
      type: "text",
      name: "productCode",
      id: "productCode",
      placeholder: "Product Code",
      className: "productCode",
    },
    {
      type: "text",
      name: "itemName",
      id: "itemName",
      placeholder: "Item Name",
      className: "itemName",
    },

    {
      type: "text",
      name: "itemDescription",
      id: "itemDescription",
      placeholder: "Item Description",
      className: "itemDescription",
    },
    {
      type: "text",
      name: "itemUnit",
      id: "itemUnit",
      placeholder: "Unit",
      className: "itemUnit",
    },
    {
      type: "select",
      name: "itemBatch",
      id: "itemBatch",
      placeholder: "Item Batch",
      className: "itemBatch",
      options: ["Yes", "No"],
    },
    {
      type: "select",
      name: "Expiration",
      id: "Expiration",
      placeholder: "Expiration",
      className: "Expiration",
      options: ["Yes", "No"],
    },
  ];
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      const fileTemp = event.currentTarget.files[0];
      setFile(fileTemp);

      const url = URL.createObjectURL(fileTemp);

      setImagePreview(url);
    }
  };

  const handleSubmit = async (values: NewItem) => {
    try {
      let imageUrl = values.itemUrl;
      if (file) {
        imageUrl = await uploadToCloudinary(file);
      }

      const formData = {
        ...values,
        imageUrl,
        batch_ctrl_item: values.itemBatch === "No" ? 0 : 1,
        expiration_ctrl_item: values.Expiration === "No" ? 0 : 1,
      };

      const response = await fetch(
        `${import.meta.env.VITE_REACT_BACKEND_URL}/items/item-update/${
          item.iditem
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code_item: formData.productCode,
            name_item: formData.itemName,
            description_item: formData.itemDescription,
            idunit_item: formData.itemUnit,
            batch_ctrl_item: formData.batch_ctrl_item,
            expiration_ctrl_item: formData.expiration_ctrl_item,
            imgurl_item: formData.imageUrl,
          }),
        }
      );

      if (response.ok) {
        toast.success("Item Updated!");
        navigate("/itemMain");
      } else {
        toast.error("Something went wrong!");
        console.error("Form submission failed", response.statusText);
      }
    } catch (error) {
      console.error("There was an error submitting the form", error);
    }
  };

  useEffect(() => {
    setImagePreview(item.imgurl_item);
  }, []);

  return (
    <section className="pb-10">
      <Link to="/itemMain">
        <Heading title="Item Configuration" />
      </Link>
      <div className="mt-8 px-[22px] max-w-[1100px]">
        <h2 className="mb-[18px] font-medium">Edit Item</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="grid-layout">
              <div className="input-container flex flex-col h-full relative">
                <label
                  htmlFor="file"
                  className="h-full cursor-pointer relative overflow-hidden bg-file flex items-center justify-center border border-dashed border-gray"
                >
                  <input
                    type="file"
                    id="file"
                    className="opacity-0"
                    onChange={handleFileChange}
                  />
                  <span className="absolute text-grayish-gray font-medium">
                    Item Image
                  </span>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Uploaded Item"
                      className=" absolute w-full h-full object-cover"
                    />
                  )}
                </label>
                <ErrorMessage
                  name="itemId"
                  component="p"
                  className="error-itemId text-red text-[.65rem]"
                />
              </div>
              {InputFields.map((field, idx) => (
                <div key={idx} className={`relative ${field.className}`}>
                  {field.type === "select" ? (
                    <Field
                      as="select"
                      name={field.name}
                      id={field.id}
                      className={`outline-none border ${
                        touched[field.name as keyof typeof touched] &&
                        errors[field.name as keyof typeof errors]
                          ? "border-red"
                          : "border-blue-500"
                      } px-[10px] py-[10px] w-full`}
                    >
                      <option value="" disabled hidden>
                        {field.placeholder}
                      </option>
                      {field.options?.map((option, index) => (
                        <option key={index} value={option} label={option} />
                      ))}
                    </Field>
                  ) : (
                    <Field
                      className={`outline-none border ${
                        touched[field.name as keyof typeof touched] &&
                        errors[field.name as keyof typeof errors]
                          ? "border-red"
                          : "border-blue-500"
                      } px-[10px] py-[10px] w-full`}
                      placeholder={field.placeholder}
                      name={field.name}
                      id={field.id}
                      type={field.type}
                    />
                  )}
                  <ErrorMessage
                    name={field.name}
                    component="p"
                    className="error-message text-red text-[.65rem] mt-1"
                  />
                </div>
              ))}
              <button
                type="submit"
                className="button hover:opacity-60 bg-second-blue text-white rounded-[10px] py-[8px] px-4"
              >
                Update Item
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};
export default EditItem;
