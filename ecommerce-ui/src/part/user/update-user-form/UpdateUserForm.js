import { Col, Button, Row, Select, Input } from "antd";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { Error } from "../../../components";
import PrefixIcon from "../../../components/prefix-icon/PrefixIcon";
import { useState } from "react";

function UpdateUserForm({ user, onSubmit }) {
    const [loading, setLoading] = useState(false);

    const schema = Yup.object().shape({
        firstname: Yup.string().required("First name is required"),
        lastname: Yup.string().required("Last name is required"),
        dateOfBirth: Yup.string()
            .required("Date of birth is required")
            .test('no-future-date', 'Birthday cannot be in the future', function(value) {
                if (!value) return true;
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return selectedDate <= today;
            }),
        phoneNumber: Yup.string().required("Phone number is required"),
        email: Yup.string().email("Please enter a valid email").required("Email is required")
    });

    const formik = useFormik({
        initialValues: {
            firstname: user.firstname,
            lastname: user.lastname,
            dateOfBirth: user.dateOfBirth,
            phoneNumber: user.phoneNumber,
            email: user.email,
            gender: user.gender || ""
        },
        validationSchema: schema,
        onSubmit: async (data) => {
            setLoading(true);
            try {
                if (onSubmit) {
                    await onSubmit(data);
                }
            } catch (error) {
                console.error("Error submitting form:", error);
            } finally {
                setLoading(false);
            }
        }
    });

    // Get today's date formatted as YYYY-MM-DD for the max attribute
    const today = new Date();
    const maxDate = today.toISOString().split('T')[0];

    return (<form onSubmit={formik.handleSubmit}>
        <Row gutter={[16, 16]}>
            <Col span={24} md={{ span: "12" }}>
                <Input
                    size="large"
                    status={(formik.errors && formik.errors.firstname) ? "error" : ""}
                    type="text"
                    id="firstname"
                    name="firstname"
                    placeholder="First Name"
                    onChange={formik.handleChange}
                    value={formik.values.firstname}
                />
                <Error>{formik.errors.firstname}</Error>
            </Col>
            <Col span={24} md={{ span: "12" }}>
                <Input
                    size="large"
                    status={(formik.errors.lastname) ? "error" : ""}
                    type="text"
                    id="lastname"
                    name="lastname"
                    placeholder="Last Name"
                    onChange={formik.handleChange}
                    value={formik.values.lastname}
                />
                <Error>{formik.errors.lastname}</Error>
            </Col>
            <Col span={24}>
                <Input
                    prefix={<PrefixIcon><i className="fi fi-rr-envelope"></i></PrefixIcon>}
                    size="large"
                    status={(formik.errors.email) ? "error" : ""}
                    type="text"
                    id="email"
                    name="email"
                    placeholder="Email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                />
                <Error>{formik.errors.email}</Error>
            </Col>
            <Col span={24}>
                <Input
                    size="large"
                    prefix={<PrefixIcon><i className="fi fi-rr-phone-office"></i></PrefixIcon>}
                    status={(formik.errors.phoneNumber) ? "error" : ""}
                    type="text"
                    id="phoneNumber"
                    placeholder="Phone Number"
                    name="phoneNumber"
                    onChange={formik.handleChange}
                    value={formik.values.phoneNumber}
                />
                <Error>{formik.errors.phoneNumber}</Error>
            </Col>
            <Col span={24} md={{ span: "12" }}>
                <Select
                    size="large"
                    style={{ width: "100%" }}
                    name="gender"
                    placeholder="Gender"
                    value={formik.values.gender || undefined}
                    onChange={e => formik.setFieldValue('gender', e)}
                >
                    <Select.Option value="Male">Male</Select.Option>
                    <Select.Option value="Female">Female</Select.Option>
                    <Select.Option value="Other">Other</Select.Option>
                </Select>
                <Error>{formik.errors.gender}</Error>
            </Col>
            <Col span={24} md={{ span: "12" }}>
                <Input
                    type="date"
                    size="large"
                    name="dateOfBirth"
                    placeholder="Date of Birth"
                    value={formik.values.dateOfBirth}
                    max={maxDate}
                    status={(formik.errors.dateOfBirth) ? "error" : ""}
                    onChange={(e) => { formik.setFieldValue('dateOfBirth', e.target.value) }}
                />
                <Error>{formik.errors.dateOfBirth}</Error>
            </Col>
            <Col span={24}>
                <Row justify="end">
                    <Button 
                        htmlType="submit" 
                        type="primary"
                        loading={loading}
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Submit"}
                    </Button>
                </Row>
            </Col>
        </Row>
    </form>);
}

export default UpdateUserForm;