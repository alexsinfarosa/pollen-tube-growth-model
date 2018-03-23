import styled from "styled-components";
// import { Icon } from "antd";

// import { pulse } from "react-animations";
// const bounceAnimation = keyframes`${pulse}`;

// screen sizes
const sm = "576px";
const md = "768px";
const lg = "1024px";
// font
// const font = "12px";
const fontSm = "14px";
const fontMd = "18px";
// paddings
const padding = "8px";
const paddingSm = "16px";
// const paddingMd = "24px";
// margins
const margin = "16px";
const marginSm = "32px";
const marginMd = "48px";

export const Row = styled.section`
  display: flex;
  justify-content: center;

  @media (min-width: ${sm}) {
    justify-content: space-between;
  }

  @media (min-width: ${md}) {
    justify-content: space-between;
  }
`;

export const Col = styled.div`
  flex: 1 1 auto;
  text-align: ${props => (props.right ? "right" : null)};
`;

export const ColMb = styled.div`
  margin-bottom: ${margin};

  @media (min-width: ${sm}) {
    margin-bottom: ${margin};
  }

  @media (min-width: ${md}) {
    margin-bottom: ${margin};
  }
`;

export const Header = Row.extend`
  background: #1da57a;
  margin-bottom: ${marginSm};
  justify-content: flex-start;

  @media (min-width: ${sm}) {
    margin-bottom: ${marginSm};
  }

  @media (min-width: ${md}) {
    margin-bottom: ${marginSm};
  }
`;

export const SubHeader = styled.div`
  font-size: 14px;
  padding: ${padding};
  letter-spacing: 1px;
  color: white;

  @media (min-width: ${sm}) {
    font-size: ${fontMd};
    padding: ${padding};
    justify-content: flex-start;
  }

  @media (min-width: ${md}) {
    font-size: ${fontMd};
    padding: ${paddingSm};
    justify-content: flex-start;
  }
`;

export const SubHeaderRight = SubHeader.extend`
  display: none;

  @media (min-width: ${sm}) {
    display: flex;
  }

  @media (min-width: ${md}) {
    display: flex;
  }
`;

export const ControlBarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;

  @media (min-width: ${sm}) {
    justify-content: space-between;
  }

  @media (min-width: ${md}) {
    justify-content: space-between;
  }

  @media (min-width: ${lg}) {
    justify-content: center;
  }
`;

export const Main = styled.section`
  display: flex;
  flex-direction: column;
  margin-left: ${margin};
  margin-right: ${margin};

  @media (min-width: ${sm}) {
    margin-left: ${marginSm};
    margin-right: ${marginSm};
  }

  @media (min-width: ${md}) {
    margin-left: ${marginMd};
    margin-right: ${marginMd};
  }

  @media (min-width: ${lg}) {
    margin: ${marginSm} auto;
    max-width: ${lg};
  }
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${margin};

  @media (min-width: ${sm}) {
    margin-bottom: ${marginSm};
  }

  @media (min-width: ${md}) {
    margin-bottom: ${marginSm};
  }

  @media (min-width: ${lg}) {
    margin-bottom: ${marginMd};
  }
`;

export const SectionMap = styled.div`
  margin: 16px auto;
  height: 35vh;

  @media (min-width: ${sm}) {
    height: 25vh;
  }

  @media (min-width: ${md}) {
    height: 25vh;
  }

  @media (min-width: ${lg}) {
    height: 25vh;
  }
`;

export const BlockWrapper = Section.extend`
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 8px;
`;

export const BHeader = styled.div`
  background: #4ea27d;
  color: #fff;
  padding: 8px 16px;
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 13px;

  @media (min-width: ${sm}) {
    font-size: ${fontSm};
  }

  @media (min-width: ${md}) {
    font-size: ${fontSm};
  }

  @media (min-width: ${lg}) {
    font-size: ${fontSm};
  }
`;

export const RowCentered = styled.div`
  display: flex;
  flex-direction: ${props => (props.column ? "column" : "row")};
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const GraphWrapper = styled.div`
  width: 100%;
  margin: 16px auto;
  height: 35vh;

  @media (min-width: ${sm}) {
    height: 25vh;
  }

  @media (min-width: ${md}) {
    height: 25vh;
  }

  @media (min-width: ${lg}) {
    height: 25vh;
  }
`;

export const MessageWrap = styled.div`
  font-size: 0.7rem;
  margin-bottom: ${margin};

  @media (min-width: ${sm}) {
    font-size: 0.8rem;
    margin-bottom: ${margin};
  }

  @media (min-width: ${md}) {
    font-size: 0.8rem;
    margin-bottom: ${margin};
  }

  @media (min-width: ${lg}) {
    font-size: 0.8rem;
    margin-bottom: ${margin};
  }
`;
