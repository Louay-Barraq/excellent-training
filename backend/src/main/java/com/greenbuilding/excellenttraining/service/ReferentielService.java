package com.greenbuilding.excellenttraining.service;

import com.greenbuilding.excellenttraining.dto.ReferentielDTO;
import com.greenbuilding.excellenttraining.model.Domaine;
import com.greenbuilding.excellenttraining.model.Profil;
import com.greenbuilding.excellenttraining.model.Structure;
import com.greenbuilding.excellenttraining.repository.DomaineRepository;
import com.greenbuilding.excellenttraining.repository.FormationRepository;
import com.greenbuilding.excellenttraining.repository.ProfilRepository;
import com.greenbuilding.excellenttraining.repository.StructureRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReferentielService {

    private final DomaineRepository domaineRepository;
    private final StructureRepository structureRepository;
    private final ProfilRepository profilRepository;
    private final FormationRepository formationRepository;

    // ===== DOMAINE =====
    public List<Domaine> findAllDomaines() {
        return domaineRepository.findAll();
    }

    public Domaine addDomaine(ReferentielDTO dto) {
        if (domaineRepository.existsByLibelle(dto.getLibelle())) {
            throw new IllegalArgumentException(
                    "Le domaine '" + dto.getLibelle() + "' existe déjà");
        }
        Domaine domaine = new Domaine();
        domaine.setLibelle(dto.getLibelle());
        return domaineRepository.save(domaine);
    }

    public Domaine updateDomaine(int id, ReferentielDTO dto) {
        Domaine domaine = domaineRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Domaine introuvable avec l'id : " + id));
        domaine.setLibelle(dto.getLibelle());
        return domaineRepository.save(domaine);
    }

    public void deleteDomaine(int id) {
        if (!domaineRepository.existsById(id)) {
            throw new EntityNotFoundException(
                    "Domaine introuvable avec l'id : " + id);
        }
        if (formationRepository.existsByDomaineId(id)) {
            throw new IllegalArgumentException(
                    "Impossible de supprimer ce domaine — il est utilisé par une formation");
        }
        domaineRepository.deleteById(id);
    }

    // ===== STRUCTURE =====
    public List<Structure> findAllStructures() {
        return structureRepository.findAll();
    }

    public Structure addStructure(ReferentielDTO dto) {
        if (structureRepository.existsByLibelle(dto.getLibelle())) {
            throw new IllegalArgumentException(
                    "La structure '" + dto.getLibelle() + "' existe déjà");
        }
        Structure structure = new Structure();
        structure.setLibelle(dto.getLibelle());
        return structureRepository.save(structure);
    }

    public Structure updateStructure(int id, ReferentielDTO dto) {
        Structure structure = structureRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Structure introuvable avec l'id : " + id));
        structure.setLibelle(dto.getLibelle());
        return structureRepository.save(structure);
    }

    public void deleteStructure(int id) {
        if (!structureRepository.existsById(id)) {
            throw new EntityNotFoundException(
                    "Structure introuvable avec l'id : " + id);
        }
        structureRepository.deleteById(id);
    }

    // ===== PROFIL =====
    public List<Profil> findAllProfils() {
        return profilRepository.findAll();
    }

    public Profil addProfil(ReferentielDTO dto) {
        if (profilRepository.existsByLibelle(dto.getLibelle())) {
            throw new IllegalArgumentException(
                    "Le profil '" + dto.getLibelle() + "' existe déjà");
        }
        Profil profil = new Profil();
        profil.setLibelle(dto.getLibelle());
        return profilRepository.save(profil);
    }

    public Profil updateProfil(int id, ReferentielDTO dto) {
        Profil profil = profilRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Profil introuvable avec l'id : " + id));
        profil.setLibelle(dto.getLibelle());
        return profilRepository.save(profil);
    }

    public void deleteProfil(int id) {
        if (!profilRepository.existsById(id)) {
            throw new EntityNotFoundException(
                    "Profil introuvable avec l'id : " + id);
        }
        profilRepository.deleteById(id);
    }
}