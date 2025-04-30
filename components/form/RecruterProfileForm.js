'use client'
import { ErrorMessage, Field, Form, Formik } from "formik"
import * as Yup from "yup"

const initialValues = {
    fullName: "",
    email: "",
    address: "",
    city: "",
    country: "",
    postal: "",
}

const RecruterProfileSchema = Yup.object().shape({
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    address: Yup.string().required("Present Address is required"),
    city: Yup.string().required("City is required"),
    postal: Yup.string().required("Post code is required"),
    country: Yup.string().required("country is required"),
})

function RecruterProfileForm() {
    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={RecruterProfileSchema}
                onSubmit={(fields) => {
                    alert(
                        "SUCCESS!! :-)\n\n" + JSON.stringify(fields, null, 4)
                    )
                }}
            >
                {({ errors, status, touched }) => (
                    <Form>
                        <div className="grid grid-cols-3 gap-5">
                            <div className="mb-5">
                                <label className="inline-block mb-2">Full Name</label>
                                <Field
                                    name="fullName"
                                    type="text"
                                    className={
                                        "input border bg-primary-50/50 rounded-xl border-pgray-100" +
                                        (errors.fullName && touched.fullName
                                            ? " is-invalid"
                                            : "")
                                    }
                                />
                                <ErrorMessage
                                    name="fullName"
                                    component="span"
                                    className="text-red-500 mt-2 text-xs"
                                />
                            </div>

                            <div className="mb-5">
                                <label className="inline-block mb-2">Email</label>
                                <Field
                                    name="email"
                                    type="text"
                                    className={
                                        "input border bg-primary-50/50 rounded-xl border-pgray-100" +
                                        (errors.email && touched.email
                                            ? " is-invalid"
                                            : "")
                                    }
                                />
                                <ErrorMessage
                                    name="email"
                                    component="span"
                                    className="text-red-500 mt-2 text-xs"
                                />
                            </div>

                            <div className="mb-5">
                                <label className="inline-block mb-2">Address</label>
                                <Field
                                    name="address"
                                    type="text"
                                    className={
                                        "input border bg-primary-50/50 rounded-xl border-pgray-100" +
                                        (errors.address && touched.address
                                            ? " is-invalid"
                                            : "")
                                    }
                                />
                                <ErrorMessage
                                    name="address"
                                    component="span"
                                    className="text-red-500 mt-2 text-xs"
                                />
                            </div>

                            <div className="mb-5">
                                <label className="inline-block mb-2">City</label>
                                <Field
                                    name="city"
                                    type="text"
                                    className={
                                        "input border bg-primary-50/50 rounded-xl border-pgray-100" +
                                        (errors.city && touched.city
                                            ? " is-invalid"
                                            : "")
                                    }
                                />
                                <ErrorMessage
                                    name="city"
                                    component="span"
                                    className="text-red-500 mt-2 text-xs"
                                />
                            </div>

                            <div className="mb-5">
                                <label className="inline-block mb-2">Post Code</label>
                                <Field
                                    name="postal"
                                    type="text"
                                    className={
                                        "input border bg-primary-50/50 rounded-xl border-pgray-100" +
                                        (errors.postal && touched.postal
                                            ? " is-invalid"
                                            : "")
                                    }
                                />
                                <ErrorMessage
                                    name="postal"
                                    component="span"
                                    className="text-red-500 mt-2 text-xs"
                                />
                            </div>

                            <div className="mb-5">
                                <label className="inline-block mb-2">Country</label>
                                <Field
                                    name="country"
                                    as="select"
                                    className={
                                        "input border bg-primary-50/50 rounded-xl border-pgray-100" +
                                        (errors.country && touched.country
                                            ? " is-invalid"
                                            : "")
                                    }
                                >
                                    <option value="Bangladesh">
                                        Bangladesh
                                    </option>
                                    <option value="United States">
                                        United States
                                    </option>
                                    <option value="United Kingdom">
                                        United Kingdom
                                    </option>
                                </Field>
                                <ErrorMessage
                                    name="country"
                                    component="span"
                                    className="text-red-500 mt-2 text-xs"
                                />
                            </div>
                        </div>

                        <div className="mt-3">
                            <button
                                type="submit"
                                className="btn px-5 bg-primary-500   text-white rounded-xl"
                            >
                                Save
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    )
}
export default RecruterProfileForm
