import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Badge, Card, Tabs, Tag, Tooltip } from 'antd'
import LazyLoad from 'react-lazy-load'

import { ImageLoader } from '../../ImageLoader'
import { NoImage } from '../../NoImage'
import EditForm from './EditForm'
import Actions from './Actions'
import { InfoItem } from './InfoItem'
import { QuantityButtons } from './QuantityButtons'
import RecipeModal from '../../Recipe/RecipeModal'
import { isNumberOrEmpty } from '../../../helpers/formatters'

const { Meta } = Card
const { TabPane } = Tabs

const IMAGE_HEIGHT = 80

const ItemCard = styled(Card)`
  width: 100%;
  position: relative;
  border-radius: ${props => props.theme.borderRadius.default} !important;
  border: 1px solid ${props => props.theme.color.border} !important;
  box-shadow: ${props => props.theme.boxShadow.default};
  transition: all 400ms ease;

  @media (max-width: 700px) {
    width: 100%;
  }

  .ant-card-actions > li > span:hover .deleteIcon {
    color: red;
  }

  .ant-tabs-extra-content {
    padding-right: 0.5rem;
  }

  .coverWrapper {
    position: relative;
    user-select: none;

    &:hover {
      img {
        transition: filter 0.4s cubic-bezier(0.43, 0.41, 0.22, 0.91);
        filter: saturate(10%);
      }
    }
  }

  img {
    width: 100%;
    height: ${IMAGE_HEIGHT}px;
    border-radius: ${props => props.theme.borderRadius.default}
      ${props => props.theme.borderRadius.default} 0 0 !important;
    object-fit: cover;
    user-select: none;
  }

  .meta {
    position: relative;
  }

  .info {
    margin: 2px -12px -6px -12px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
  }

  .orphanTag {
    position: absolute;
    bottom: 0;
    left: 0;
    color: white;
    background: ${props => props.theme.color.reds[5]};
    padding: 2px 6px;
    border-radius: 0 2px 0 0;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    z-index: 10;
  }

  .tabs {
    margin: -12px -12px -12px -12px;

    .ant-tabs-bar {
      margin-bottom: 0;
    }
  }
`

const Title = styled.div`
  color: black;
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.color.link};
  }

  .isOrphan {
    color: ${props => props.theme.color.reds[10]};
  }
`

const TabContent = styled.div`
  padding: 12px;
`

const ContentWrapper = styled.div`
  .tags {
    margin-bottom: 0.75rem;
  }
`

const PlannerItem = ({
  loading,
  title,
  image,
  itemUUID,
  recipeUUID,
  compactView,
  isOrphan,
  isOrganic,
  isFrozen,
  quantity,
  revenue,
  cost,
  grossProfit,
  currency,
  useQuickButtons,
  // onDuplicateClick,
  onDeleteClick,
  onUpdateItem,
  onQuantityIncrease,
  onQuantityDecrease,
}) => {
  const [editMode, setEditMode] = useState(false)
  const [recipeVisible, setRecipeVisible] = useState(false)

  const handleSetRecipeVisible = isVisible => setRecipeVisible(isVisible)

  const handleEditModeSave = itemData => {
    setEditMode(false)
    onUpdateItem(itemData)
  }

  const renderMetaContent = (
    <ContentWrapper>
      <div className="tags">
        {isOrganic && <Tag color="green">Organic</Tag>}
        {isFrozen && <Tag color="blue">Frozen</Tag>}
      </div>
    </ContentWrapper>
  )

  const renderImage = () => {
    if (!compactView) {
      return image ? (
        <>
          {useQuickButtons && (
            <QuantityButtons
              onIncrease={() => onQuantityIncrease(itemUUID)}
              onDecrease={() => onQuantityDecrease(itemUUID)}
            />
          )}

          <LazyLoad
            width="100%"
            height={IMAGE_HEIGHT}
            debounce={false}
            offsetVertical={500}
          >
            <ImageLoader src={image} alt="" duration="1s" />
          </LazyLoad>
        </>
      ) : (
        <>
          <QuantityButtons
            onIncrease={() => onQuantityIncrease(itemUUID)}
            onDecrease={() => onQuantityDecrease(itemUUID)}
          />
          <NoImage />
        </>
      )
    }
    return null
  }

  const renderCover = !loading && (
    <div className="coverWrapper">
      {isOrphan && !compactView && (
        <Tooltip placement="bottom" title="Item is Orphan" mouseEnterDelay={1}>
          <div className="orphanTag">Orphan</div>
        </Tooltip>
      )}

      <div className="imageWrapper">{renderImage()}</div>
    </div>
  )

  const renderTitle = isOrphan ? (
    <Badge
      status="error"
      text={
        <Tooltip placement="top" title={title} mouseEnterDelay={1}>
          <Title
            className="isOrphan"
            role="presentation"
            onClick={() => setRecipeVisible(true)}
          >
            {title}
          </Title>
        </Tooltip>
      }
    />
  ) : (
    <Tooltip placement="top" title={title} mouseEnterDelay={1}>
      <Title role="presentation" onClick={() => setRecipeVisible(true)}>
        {title}
      </Title>
    </Tooltip>
  )

  const content = (
    <div className="info">
      <InfoItem label="Qnt" title="Quantity">
        {isNumberOrEmpty(Number(quantity))}
      </InfoItem>
      <InfoItem label="Cost" unit={currency || '£'} title="Cost">
        {isNumberOrEmpty(Number(cost))}
      </InfoItem>
      <InfoItem label="Rev" unit={currency || '£'} title="Revenue">
        {isNumberOrEmpty(revenue)}
      </InfoItem>
      <InfoItem
        label="GP"
        unit="%"
        title="Gross Profit"
        positive={grossProfit > 0}
        negative={grossProfit < 0}
      >
        {isNumberOrEmpty(grossProfit)}
      </InfoItem>
    </div>
  )

  return (
    <>
      {editMode ? (
        <EditForm
          title={renderTitle}
          quantity={quantity}
          onSave={handleEditModeSave}
          onCancel={() => setEditMode(false)}
        />
      ) : (
        <ItemCard loading={loading} size="small" cover={renderCover}>
          <Tabs
            className="tabs"
            defaultActiveKey="info"
            size="small"
            tabBarExtraContent={Actions({
              onEdit: () => setEditMode(true),
              onDelete: () => onDeleteClick(itemUUID),
              // onDuplicate: () => onDuplicateClick(),
            })}
          >
            <TabPane tab="Info" key="info">
              <TabContent>
                <Meta
                  className="meta"
                  title={renderTitle}
                  description={renderMetaContent}
                />
                {content}
              </TabContent>
            </TabPane>
            <TabPane tab="Portions" key="portions">
              <TabContent>Portions Section if any...</TabContent>
            </TabPane>
          </Tabs>
        </ItemCard>
      )}

      <RecipeModal
        isVisible={recipeVisible}
        setVisible={handleSetRecipeVisible}
        recipeUUID={recipeUUID}
      />
    </>
  )
}

PlannerItem.propTypes = {
  loading: PropTypes.bool,
  compactView: PropTypes.bool,
  isOrphan: PropTypes.bool,
  isFrozen: PropTypes.bool,
  isOrganic: PropTypes.bool,
  title: PropTypes.string,
  image: PropTypes.string,
  itemUUID: PropTypes.string.isRequired,
  recipeUUID: PropTypes.string.isRequired,
  quantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  revenue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  cost: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  grossProfit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  currency: PropTypes.string,
  useQuickButtons: PropTypes.bool,
  onQuantityIncrease: PropTypes.func,
  onQuantityDecrease: PropTypes.func,
  onDeleteClick: PropTypes.func,
  onUpdateItem: PropTypes.func,
  // onDuplicateClick: PropTypes.func,
}

PlannerItem.defultProps = {
  loading: true,
  useQuickButtons: false,
  compactView: true,
  isOrphan: false,
}

export default PlannerItem
