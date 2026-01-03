import { http, HttpResponse } from 'msw'


const INGREDIENTS = [
    { id: 1, name: 'Tomato Sauce' },
    { id: 2, name: 'Mozzarella'},
]

export const handlers = [
    http.get('api/ingredients', () => {
        return HttpResponse.json(INGREDIENTS)
    }),
    http.get('api/ingredients/:id', (req) => {
        const { id } = req.params
        const ingredient = INGREDIENTS.find(ing => ing.id === Number(id))
        if (ingredient) {
            return HttpResponse.json(ingredient)
        } else {
            return HttpResponse.json({ error: 'Ingredient not found' }, { status: 404 })
        }
    }),
]