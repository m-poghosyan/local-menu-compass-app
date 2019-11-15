import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import startOfWeek from 'date-fns/start_of_week'
import { Button, DatePicker, Form, Input, Modal, Select } from 'antd'

import { convertToJsonODataDate, convertToEdmDateTime } from '../../utils/dates'
import { intersection } from '../../utils/arrays'
// import { DATE_FORMAT } from '../../constants'

const { RangePicker, WeekPicker } = DatePicker
const { Option, OptGroup } = Select

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

const CreateMenuForm = ({
  loading,
  conceptItems,
  centralMenuItems,
  isVisible,
  setVisible,
  createMenu,
  form,
}) => {
  const [concept, setConcept] = useState(null)
  const [conceptType, setConceptType] = useState(null)
  const [activeConcepts, setActiveConcepts] = useState([])

  useEffect(() => {
    /* Let's filter the concepts that don't have a matching Central Menu
    so that we can only create a new Menu from central (MEC) for the ones
    that are actually possible to create from */
    if (conceptItems.length && conceptItems.length) {
      const filteredMECConcepts = intersection(
        conceptItems,
        centralMenuItems,
        (a, b) => a.concepttype === 'MEC' && a.menuid === b.MenuID
      )

      // setActiveConcepts(filteredConcepts)
      const conceptsMEN = conceptItems.filter(
        item => item.concepttype === 'MEN'
      )
      const allActiveConcepts = [...conceptsMEN, ...filteredMECConcepts]
      setActiveConcepts(allActiveConcepts)
    }
  }, [centralMenuItems, conceptItems])

  const submitForm = values => {
    // Local Menu Creation
    if (conceptType === 'MEN') {
      const SITE = 'F000' // TODO Don't hardcode this...
      const { conceptoffer, description, dates } = values
      const start = convertToJsonODataDate(dates[0])
      const end = convertToJsonODataDate(dates[1])

      const formData = {
        DateFrom: start,
        DateTo: end,
        Concept: conceptoffer,
        SiteID: SITE,
        Description: description,
        MenuType: conceptType,
      }
      createMenu(conceptType, JSON.stringify(formData))
      // Central Menu Creation
    } else if (conceptType === 'MEC') {
      const SITE = 'F000' // TODO Don't hardcode this...
      const { description, week } = values
      const { menuid } = concept
      const firstMonday = convertToEdmDateTime(
        startOfWeek(week, { weekStartsOn: 1 })
      )

      /* Get the MenuUUID and MenuID from the Central Menu associated with
      the selected concept */
      const { MenuUUID, MenuID } = centralMenuItems.find(
        menu => menu.MenuID === menuid
      )

      createMenu(conceptType, {
        uuid: MenuUUID,
        concept: MenuID,
        site: SITE,
        description,
        firstMonday,
      })
    }

    // setVisible(false)
    form.resetFields()
  }

  const handleConceptChange = value => {
    const conceptItem = activeConcepts.find(item => item.conceptoffer === value)
    setConcept(conceptItem)
    setConceptType(conceptItem.concepttype)
  }

  // TODO: Also search against description
  const handleConceptSearch = value => {
    console.log(value)
  }

  const handleSubmit = event => {
    event.preventDefault()
    form.validateFields((err, values) => {
      if (!err) submitForm(values)
    })
  }

  const { getFieldDecorator } = form

  return (
    <Modal
      centered
      title="Create New Menu"
      visible={isVisible}
      confirmLoading={loading}
      onCancel={() => setVisible(false)}
      footer={[
        <Button key="cancel" onClick={() => setVisible(false)}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Submit
        </Button>,
      ]}
    >
      <Form
        labelCol={formItemLayout.labelCol}
        wrapperCol={formItemLayout.wrapperCol}
      >
        <Form.Item label="Concept">
          {getFieldDecorator('conceptoffer', {
            initialValue: [''],
            rules: [
              {
                type: 'string',
                required: true,
                message: 'Please select the menu concept!',
              },
            ],
          })(
            <Select
              showSearch
              onChange={handleConceptChange}
              onSearch={handleConceptSearch}
              // TODO : Fix the filtering, search against key and description
              // filterOption={(input, option) => (option.key ? option : null)}
            >
              <OptGroup label="MEN">
                {activeConcepts
                  .filter(item => item.concepttype === 'MEN')
                  .map(item => (
                    <Option value={item.conceptoffer} key={item.conceptoffer}>
                      {item.short_description} - {item.conceptoffer}
                    </Option>
                  ))}
              </OptGroup>

              <OptGroup label="MEC">
                {activeConcepts
                  .filter(item => item.concepttype === 'MEC')
                  .map(item => (
                    <Option value={item.conceptoffer} key={item.conceptoffer}>
                      {item.short_description} - {item.conceptoffer}
                    </Option>
                  ))}
              </OptGroup>
            </Select>
          )}
        </Form.Item>

        <Form.Item label="Description">
          {getFieldDecorator('description', {
            rules: [
              {
                required: true,
                message: 'Please input your description!',
              },
            ],
          })(<Input />)}
        </Form.Item>

        {(conceptType === null || conceptType === 'MEN') && (
          <Form.Item label="Date Range">
            {getFieldDecorator('dates', {
              rules: [
                {
                  required: true,
                  message: 'Please select the date range!',
                },
              ],
            })(<RangePicker disabled={!conceptType} />)}
          </Form.Item>
        )}

        {conceptType === 'MEC' && (
          <Form.Item label="Week">
            {getFieldDecorator('week', {
              rules: [
                {
                  required: true,
                  message: 'Please select the desired week!',
                },
              ],
            })(<WeekPicker disabled={!conceptType} />)}
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}

CreateMenuForm.propTypes = {
  loading: PropTypes.bool,
  conceptItems: PropTypes.array.isRequired,
  centralMenuItems: PropTypes.array.isRequired,
  isVisible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  createMenu: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
}

const CreateMenuFormModal = Form.create({ name: 'createmenu' })(CreateMenuForm)

export { CreateMenuFormModal }
