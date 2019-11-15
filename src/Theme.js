import React from 'react'
import { ThemeProvider } from 'styled-components'
import PropTypes from 'prop-types'

const Theme = ({ children }) => (
  <ThemeProvider
    theme={{
      screen: {
        xs: '480px',
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px',
        xxl: '1600px',
      },

      color: {
        transparent: 'transparent',

        primary: '#1890ff',
        info: '#1890ff',
        warning: '#faad14',
        success: '#52c41a',
        error: '#f5222d',
        processing: '#1890ff',
        highlight: '#f5222d',
        normal: '#d9d9d9',

        background: '#f5f5f5',
        border: '#d9d9d9',
        disabled: '#bfbfbf',
        shadow: '#00000026',
        link: '#1890ff',

        black: '#000000',
        white: '#ffffff',
        gray: '#bfbfbf',
        red: '#f5222d',
        volcano: '#fa541c',
        orange: '#fa8c16',
        gold: '#faad14',
        yellow: '#fadb14',
        lime: '#a0d911',
        green: '#52c41a',
        cyan: '#13c2c2',
        blue: '#1890ff',
        geekBlue: '#2f54eb',
        purple: '#722ed1',
        pink: '#eb2f96',

        // Shades
        grays: {
          1: '#ffffff',
          2: '#fafafa',
          3: '#f5f5f5',
          4: '#e8e8e8',
          5: '#d9d9d9',
          6: '#bfbfbf',
          7: '#8c8c8c',
          8: '#595959',
          9: '#262626',
          10: '#262626',
        },

        reds: {
          1: '#fff1f0',
          2: '#ffccc7',
          3: '#ffa39e',
          4: '#ff7875',
          5: '#ff4d4f',
          6: '#f5222d',
          7: '#cf1322',
          8: '#a8071a',
          9: '#820014',
          10: '#5c0011',
        },

        volcanos: {
          1: '#fff2e8',
          2: '#ffd8bf',
          3: '#ffbb96',
          4: '#ff9c6e',
          5: '#ff7a45',
          6: '#fa541c',
          7: '#d4380d',
          8: '#ad2102',
          9: '#871400',
          10: '#610b00',
        },

        oranges: {
          1: '#fff7e6',
          2: '#ffe7ba',
          3: '#ffd591',
          4: '#ffc069',
          5: '#ffa940',
          6: '#fa8c16',
          7: '#d46b08',
          8: '#ad4e00',
          9: '#873800',
          10: '#612500',
        },

        golds: {
          1: '#fffbe6',
          2: '#fff1b8',
          3: '#ffe58f',
          4: '#ffd666',
          5: '#ffc53d',
          6: '#faad14',
          7: '#d48806',
          8: '#ad6800',
          9: '#874d00',
          10: '#613400',
        },

        yellows: {
          1: '#feffe6',
          2: '#ffffb8',
          3: '#fffb8f',
          4: '#fff566',
          5: '#ffec3d',
          6: '#fadb14',
          7: '#d4b106',
          8: '#ad8b00',
          9: '#876800',
          10: '#614700',
        },

        limes: {
          1: '#fcffe6',
          2: '#f4ffb8',
          3: '#eaff8f',
          4: '#d3f261',
          5: '#bae637',
          6: '#a0d911',
          7: '#7cb305',
          8: '#5b8c00',
          9: '#3f6600',
          10: '#254000',
        },

        greens: {
          1: '#f6ffed',
          2: '#d9f7be',
          3: '#b7eb8f',
          4: '#95de64',
          5: '#73d13d',
          6: '#52c41a',
          7: '#389e0d',
          8: '#237804',
          9: '#135200',
          10: '#092b00',
        },

        cyans: {
          1: '#e6fffb',
          2: '#b5f5ec',
          3: '#87e8de',
          4: '#5cdbd3',
          5: '#36cfc9',
          6: '#13c2c2',
          7: '#08979c',
          8: '#006d75',
          9: '#00474f',
          10: '#002329',
        },

        blues: {
          1: '#e6f7ff',
          2: '#bae7ff',
          3: '#91d5ff',
          4: '#69c0ff',
          5: '#40a9ff',
          6: '#1890ff',
          7: '#096dd9',
          8: '#0050b3',
          9: '#003a8c',
          10: '#002766',
        },

        geekBlues: {
          1: '#f0f5ff',
          2: '#d6e4ff',
          3: '#adc6ff',
          4: '#85a5ff',
          5: '#597ef7',
          6: '#2f54eb',
          7: '#1d39c4',
          8: '#10239e',
          9: '#061178',
          10: '#030852',
        },

        purples: {
          1: '#f9f0ff',
          2: '#efdbff',
          3: '#d3adf7',
          4: '#b37feb',
          5: '#9254de',
          6: '#722ed1',
          7: '#531dab',
          8: '#391085',
          9: '#22075e',
          10: '#120338',
        },

        pinks: {
          1: '#fff0f6',
          2: '#ffd6e7',
          3: '#ffadd2',
          4: '#ff85c0',
          5: '#f759ab',
          6: '#eb2f96',
          7: '#c41d7f',
          8: '#9e1068',
          9: '#780650',
          10: '#520339',
        },
      },

      padding: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },

      fontSize: {
        sm: '12px',
        base: '14px',
        lg: '16px',
        xl: '18px',
        xxl: '24px',
      },

      borderRadius: {
        none: '0',
        sm: '2px',
        default: '4px',
        lg: '6px',
        full: '9999px',
      },

      boxShadow: {
        default:
          '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg:
          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl:
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        outline: '0 0 0 3px rgba(66, 153, 225, 0.5)',
        none: 'none',
      },
    }}
  >
    {children}
  </ThemeProvider>
)

Theme.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

export default Theme
