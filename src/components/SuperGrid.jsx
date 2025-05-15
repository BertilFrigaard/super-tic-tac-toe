import "./SuperGrid.css";

import Grid from "./Grid";

function SuperGrid({ grids, availableGrids, gridResults, onClick }) {
    return (
        <div className="super-grid-container">
            {grids.map((v, iGrid) => (
                <Grid key={iGrid} fields={v} available={availableGrids.includes(iGrid)} overlayLabel={gridResults[iGrid]} onClick={(iField) => {onClick(iGrid, iField)}}/>
            ))}
        </div>
    )
}

export default SuperGrid;