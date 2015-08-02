let React = require('react');

let SpriteManager = React.createClass({
  render: function () {
    let sprites = this.props.sprites;
    let activeSprite = this.props.activeSprite;
    let spriteViews = [];

    for (let i = 0; i < sprites.length; i++) {
      let sprite = sprites[i];
      let spriteStyle = {
        width: sprite.size,
        height: sprite.size
      };

      spriteViews.push(
        <li className="sprite">
          <img src={sprite.dataUrl}
               style={spriteStyle}/>
        </li>
      );
    }

    return (
      <ul className="sprite-manager">
        {spriteViews}
      </ul>
    );
  }
});

export default SpriteManager;
