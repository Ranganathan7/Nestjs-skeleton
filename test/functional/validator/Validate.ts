import * as jsonschema from 'jsonschema'
function validateschema(data: any, schema: any) {
    const Validator = jsonschema.Validator;
    const v = new Validator();
    return v.validate(data, schema)
}
export default validateschema