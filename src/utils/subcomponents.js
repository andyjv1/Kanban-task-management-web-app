function subcomponents(subcomponent, arrayOfComponents, fullListSubcomponents) {
    subcomponent.forEach(column => {
        arrayOfComponents.find(obj => obj.id === column)
        if (arrayOfComponents.find(obj => obj.id === column)) {
            fullListSubcomponents.push(arrayOfComponents.find(obj => obj.id === column)
            )
        }
    })

    return fullListSubcomponents
}
module.exports = { subcomponents }
