import React from "react";

const Message = props => {
  const { bl } = props;
  let count = 0;
  count = bl.dates.length;
  console.log(count);

  if (count === 1) {
    return (
      <div>
        The first blossom thinning spray in the Block should be applied when the
        pollen tube length has reached 100% of the style length. Entering this
        spray date resets the model to 0%.
      </div>
    );
  }

  if (count === 2) {
    return (
      <div>
        <div>
          The second blossom thinning spray in the Block should be applied when
          the pollen tube length is between 50 and 60% of the style length.
          Entering this spray date resets the model to 0%.
        </div>
        <small>
          If a frost killed the king bloom, the later blooming flowers may be
          the ones you want to keep to set the crop. Therefore, it may warrant
          waiting until reaching the 100% fertilization threshold before
          applying the subsequent bloom thinning spray.
        </small>
      </div>
    );
  }

  if (count === 3) {
    return (
      <div>
        <div>
          If a third blossom thinning spray is needed in the Block, it should be
          applied when the pollen tube length is between 50 and 60% of the style
          length. Entering this spray date resets the model to 0%. The model
          will keep running until July 1.
        </div>
        <small>
          If a frost killed the king bloom, the later blooming flowers may be
          the ones you want to keep to set the crop. Therefore, it may warrant
          waiting until reaching the 100% fertilization threshold before
          applying the subsequent bloom thinning spray.
        </small>
      </div>
    );
  }

  if (count > 3) return null;
};

export default Message;
