import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const AdSlot = ({
    adSlot,
    adFormat = 'auto',
    fullWidthResponsive = true,
    style = { display: 'block' },
    className = ''
}) => {
    useEffect(() => {
        try {
            // Push ad to AdSense queue
            if (window.adsbygoogle && window.adsbygoogle.loaded) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (error) {
            console.error('AdSense error:', error);
        }
    }, []);

    return (
        <div className={`adsense-container ${className}`}>
            <ins
                className="adsbygoogle"
                style={style}
                data-ad-client="ca-pub-8414925390417908"
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive={fullWidthResponsive.toString()}
            />
        </div>
    );
};

AdSlot.propTypes = {
    adSlot: PropTypes.string.isRequired,
    adFormat: PropTypes.string,
    fullWidthResponsive: PropTypes.bool,
    style: PropTypes.object,
    className: PropTypes.string
};

export default AdSlot;
