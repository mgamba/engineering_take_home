class FieldValidator < ActiveModel::Validator
  class << self
    def validate!(metadata:, params:)
      schema = generate_record_schema(metadata)
      JSON::Validator.validate!(schema, params)
    end

    private

    def generate_record_schema(metadata)
      {
        type: "object",
        properties: metadata.map{ generate_field_schema(_1) }.compact.to_h,
        minItems: 1,
        uniqueItems: true,
      }
    end

    # Custom Fields are associated with a single client
    # Custom Fields can be one of 3 types: number, freeform, or enum
    #  - Number fields can be any decimal number (e.g., Number of bathrooms: 2.5)
    #  - Freeform fields are strings (e.g., Living room color: “Blue”)
    #  - Enum is a choice of strings (e.g., Type of walkway: “Brick, Concrete, or None”)
    def generate_field_schema(field)
      case field["type"]
      when "Number"
        number_schema(field_name: field["name"])
      when "Freeform"
        freeform_schema(field_name: field["name"])
      when "Enum"
        enum_schema(field_name: field["name"], options: field["options"])
      else
        nil
      end
    end

    def number_schema(field_name:)
      [
        field_name,
        {
          type: ["number", "null"],
        }
      ]
    end

    def freeform_schema(field_name:)
      [
        field_name,
        {
          type: ["string", "null"],
        },
      ]
    end

    def enum_schema(field_name:, options:)
      [
        field_name,
        {
          type: ["string", "null"],
          enum: [*options, nil],
        },
      ]
    end

    def custom_field_metaschema
      {
        "type": "object",
        "required": ["fields"],
        "properties": {
          fields: {
            type: "array",
            items: {
              "oneOf": [{
                type: "object",
                "required": ["fieldName", "fieldType"],
                properties: {
                  fieldName: {
                    type: "string",
                  },
                  fieldType: {
                    const: "Number",
                  },
                },
              }, {
                type: "object",
                "required": ["fieldName", "fieldType"],
                properties: {
                  fieldName: {
                    type: "string",
                  },
                  fieldType: {
                    const: "Freeform",
                  },
                },
              }, {
                type: "object",
                "required": ["fieldName", "fieldType", "fieldOptions"],
                properties: {
                  fieldName: {
                    type: "string",
                  },
                  fieldType: {
                    const: "Enum",
                  },
                  fieldOptions: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    minItems: 1,
                    uniqueItems: true,
                  },
                },
              }]
            },
            minItems: 1,
            uniqueItems: true,
          },
        },
      }
    end
  end
end
