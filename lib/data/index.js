import { petList1 } from './pets1.js';
import { petList10 } from './pets10.js';
import { petList2 } from './pets2.js';
import { petList3 } from './pets3.js';
import { petList4 } from './pets4.js';
import { petList5 } from './pets5.js';
import { petList6 } from './pets6.js';
import { petList7 } from './pets7.js';
import { petList8 } from './pets8.js';
import { petList9 } from './pets9.js';

const allPets = [
    ...petList1,
    ...petList2,
    ...petList3,
    ...petList4,
    ...petList5,
    ...petList6,
    ...petList7,
    ...petList8,
    ...petList9,
    ...petList10
];
function findPetByName(name) {
    const trimmed = name.trim();
    const exact = allPets.find(p => p.name === trimmed);
    if (exact) {
        return exact;
    }
    return allPets.find(p => p.name.includes(trimmed) || trimmed.includes(p.name));
}
function findPetById(id) {
    return allPets.find(p => p.id === id);
}
function filterPetsByElement(element) {
    return allPets.filter(p => {
        const el = p.element;
        return Array.isArray(el) ? el.includes(element) : el === element;
    });
}
function searchSkill(skillName) {
    const results = [];
    const trimmed = skillName.trim();
    for (const pet of allPets) {
        for (const skill of pet.skills) {
            if (skill.name === trimmed || skill.name.includes(trimmed)) {
                results.push({ pet, skill });
            }
        }
    }
    return results;
}
function getPetElements(pet) {
    return Array.isArray(pet.element) ? pet.element : [pet.element];
}
function getTotalStats(pet) {
    return pet.hp + pet.atk + pet.mat + pet.def + pet.mdf + pet.spd;
}

export { allPets, filterPetsByElement, findPetById, findPetByName, getPetElements, getTotalStats, searchSkill };
