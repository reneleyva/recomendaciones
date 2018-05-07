/**
 * Esto módulo tiene como fin implementar QuickSort 
 * para la manipulación de objetos películas en recomendador. 
 */

//Intercambia los elementos de 2 indices. 
function swap(items, firstIndex, secondIndex){
    var temp = items[firstIndex];
    items[firstIndex] = items[secondIndex];
    items[secondIndex] = temp;
}

/**
 * Proceso de partición de quicksort
 * recibe un arreglo items e índices left, right.
 */
function partition(items, left, right) {

    var pivot = items[Math.floor((right + left) / 2)].valor, i = left, j = right;


    while (i <= j) {

        while (items[i].valor > pivot) {
            i++;
        }

        while (items[j].valor < pivot) {
            j--;
        }

        if (i <= j) {
            swap(items, i, j);
            i++;
            j--;
        }
    }

    return i;
}

/**
 * Función quick sort. Recibe el arreglo de items. 
 * Recibe indice left, right indicando los 2 indices extras 
 * correspondientes al algoritmo quicksort para comparar elementos 
 * deacuerdo al pívote. 
 */
function quickSort(items, left, right) {

    var index;

    if (items.length > 1) {

        left = typeof left != "number" ? 0 : left;
        right = typeof right != "number" ? items.length - 1 : right;

        index = partition(items, left, right);

        if (left < index - 1) {
            quickSort(items, left, index - 1);
        }

        if (index < right) {
            quickSort(items, index, right);
        }

    }

    return items;
}

module.exports = quickSort;