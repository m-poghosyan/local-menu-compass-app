import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Layout, PageHeader } from 'antd'
import { withRouter } from 'react-router-dom'

import { RouterView } from '../components/RouterView'
import routes from '../routes'

const { Content } = Layout

const ContentWrapper = styled.div``

const InnerContent = styled.div`
  min-height: calc(100vh - 156px);
  position: relative;
  padding: 24px;
`

const StyledContent = styled(Content)`
  margin: 16px;
  background: white;
`

const getMeta = ({ pathname }, prop) => {
  const route = routes.find(r => r.path === pathname)
  return route ? route[prop] : ''
}

let headerContent = null
let extraHeaderContent = null

const DefaultLayout = withRouter(({ showMenu, location, history }) => {
  const [setTitle, setSetTitle] = useState(null)
  const [setSubtitle, setSetSubtitle] = useState(null)

  const handleTitle = value => setSetTitle(value)
  const handleSubTitle = value => setSetSubtitle(value)
  const handleHeaderContent = render => {
    headerContent = render
  }
  const handleHeaderExtra = render => {
    extraHeaderContent = render
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {showMenu && <RouterView name="menu" title="Local Planner" />}
      <ContentWrapper
        style={{
          marginTop: 0,
        }}
      >
        <PageHeader
          onBack={() => {
            history.goBack()
          }}
          title={getMeta(location, 'title') || setTitle}
          subTitle={getMeta(location, 'subtitle') || setSubtitle}
          extra={extraHeaderContent && extraHeaderContent()}
          style={{
            marginBottom: 16,
          }}
        >
          {headerContent && headerContent()}
        </PageHeader>

        <StyledContent>
          <InnerContent>
            <RouterView
              name="main"
              setTitle={handleTitle}
              setSubTitle={handleSubTitle}
              headerContent={handleHeaderContent}
              headerExtra={handleHeaderExtra}
            />
          </InnerContent>
        </StyledContent>
      </ContentWrapper>
    </Layout>
  )
})

DefaultLayout.propTypes = {
  showMenu: PropTypes.bool,
  location: PropTypes.object,
  history: PropTypes.object,
}

export default DefaultLayout
