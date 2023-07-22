function columnIds(board, columns) {
    const arrayOfColumns = Object.keys(columns.entities).map(key => columns.entities[key]);
    const columnIds = arrayOfColumns.map(s => s.id)

    const columnInBoard = board.columns.filter(i => columnIds.includes(i))

    return columnInBoard
}
module.exports = { columnIds }
