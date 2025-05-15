import "./Grid.css";

import Field from "./Field";

function Grid({ fields, available, overlayLabel, onClick }) {
    return (
        <div className="grid-wrapper">
            <div className={available ? "grid-overlay grid-available" : "grid-overlay grid-unavailable"}> 
                {overlayLabel && 
                    <p className="grid-label">{overlayLabel}</p>
                }
            </div>
            <div className="grid-background">
                <div className="grid-container">
                    {fields.map((v, i) => (
                        <Field key={i} value={v} onClick={() => {onClick(i)}}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Grid;