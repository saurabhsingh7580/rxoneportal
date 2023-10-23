import Form from "react-bootstrap/Form";

function ScheduleModalRadio(props) {
  const { type, name, field, meta, inputs } = props;

  return inputs.map(ip => (
    <Form.Group
      className="mx-2 d-inline-flex align-items-center"
      key={ip.value}
    >
      <input
        {...field}
        type={type}
        name={name}
        value={ip.value}
        // {...(type === "radio" ? { checked: meta.value === ip.value } : {})}
        // defaultChecked={false}
        checked={meta.value?.includes(ip.value.toString())}
      />

      <div className="mb-0 ms-1">{ip.label}</div>
    </Form.Group>
  ));
}

export default ScheduleModalRadio;
