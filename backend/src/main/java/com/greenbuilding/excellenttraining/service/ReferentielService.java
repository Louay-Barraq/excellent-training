package com.greenbuilding.excellenttraining.service;

import com.greenbuilding.excellenttraining.dto.ReferentielDTO;
import com.greenbuilding.excellenttraining.model.*;
import com.greenbuilding.excellenttraining.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReferentielService {

    private final DomaineRepository domaineRepository;
    private final StructureRepository structureRepository;
    private final ProfilRepository profilRepository;
    private final FormationRepository formationRepository;
    private final ParticipantRepository participantRepository;
    private final EmployeurRepository employeurRepository;
    private final FormateurRepository formateurRepository;

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

    @Transactional
    public void deleteDomaine(int id) {
        if (!domaineRepository.existsById(id)) {
            throw new EntityNotFoundException(
                    "Domaine introuvable avec l'id : " + id);
        }
        if (formationRepository.existsByDomaineId(id)) {
            throw new IllegalArgumentException(
                    "Impossible de supprimer ce domaine car il est associe a une ou plusieurs formations.");
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

    @Transactional
    public void deleteStructure(int id) {
        if (!structureRepository.existsById(id))
            throw new EntityNotFoundException("Structure introuvable avec l'id : " + id);

        if (participantRepository.existsByStructureId(id)) {
            throw new IllegalArgumentException(
                    "Impossible de supprimer cette structure car des participants y sont rattachés.");
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

    @Transactional
    public void deleteProfil(int id) {
        if (!profilRepository.existsById(id))
            throw new EntityNotFoundException("Profil introuvable avec l'id : " + id);

        if (participantRepository.existsByProfilId(id)) {
            throw new IllegalArgumentException(
                    "Impossible de supprimer ce profil car des participants y sont rattachés.");
        }
        profilRepository.deleteById(id);
    }

    // ===== EMPLOYEUR =====
    public List<Employeur> findAllEmployeurs() {
        return employeurRepository.findAll();
    }

    public Employeur addEmployeur(ReferentielDTO dto) {
        if (employeurRepository.existsByNomEmployeur(dto.getLibelle())) {
            throw new IllegalArgumentException(
                    "L'employeur '" + dto.getLibelle() + "' existe déjà");
        }
        Employeur employeur = new Employeur();
        employeur.setNomEmployeur(dto.getLibelle());
        return employeurRepository.save(employeur);
    }

    public Employeur updateEmployeur(int id, ReferentielDTO dto) {
        Employeur employeur = employeurRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Employeur introuvable with id : " + id));
        employeur.setNomEmployeur(dto.getLibelle());
        return employeurRepository.save(employeur);
    }

    @Transactional
    public void deleteEmployeur(int id) {
        if (!employeurRepository.existsById(id))
            throw new EntityNotFoundException("Employeur introuvable with id : " + id);

        if (formateurRepository.existsByEmployeurId(id)) {
            throw new IllegalArgumentException(
                    "Impossible de supprimer cet employeur car des formateurs y sont rattachés.");
        }
        employeurRepository.deleteById(id);
    }
}