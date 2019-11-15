import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Card, Button, Form, InputNumber } from 'antd'

import { deepStringifyValues } from '../../../utils/objects'

const CardEditForm = styled(Card)`
  /* width: 225px; */
  width: 100%;
  display: relative;
  transition: all 400ms ease;

  .title {
    color: black;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;

    a {
      color: black;

      &:hover {
        color: #40a9ff;
      }
    }
  }
`

function CreateEditForm({ title, quantity, style, onSave, onCancel, form }) {
  const handleSave = () => {
    form.validateFields((err, values) => {
      if (!err) {
        const data = deepStringifyValues(values) // SAP only accepts String vlaues... jeez!
        onSave(data)
      }
    })
  }

  const { getFieldDecorator } = form

  return (
    <CardEditForm
      hoverable
      size="small"
      style={style}
      actions={[
        <Button type="default" onClick={handleSave}>
          Save
        </Button>,
        <Button type="danger" onClick={onCancel}>
          Cancel
        </Button>,
      ]}
    >
      <div className="title">{title}</div>

      <Form layout="inline">
        <Form.Item label="Quantity">
          {getFieldDecorator('Quantity', {
            initialValue: quantity,
          })(<InputNumber style={{ width: '58px' }} size="small" min={1} />)}
        </Form.Item>
      </Form>
    </CardEditForm>
  )
}

CreateEditForm.propTypes = {
  title: PropTypes.object || PropTypes.string,
  quantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  style: PropTypes.object,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  form: PropTypes.object.isRequired,
}

const EditForm = Form.create({ name: 'itemEditForm' })(CreateEditForm)

export default EditForm
