package startup.vsvisualizer.controller.datastructures.linkedlist;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import startup.vsvisualizer.dto.algorithms.AlgorithmResponse;
import startup.vsvisualizer.dto.datastructures.array.ArrayOperationRequest;
import startup.vsvisualizer.service.datastructures.linkedlist.LinkedListVisualizationFacade;

import java.util.List;

@RestController
@CrossOrigin(origins = "https://visualizer-frontend-production-9da8.up.railway.app")
@RequestMapping("/api/data-structures/linked-list")
public class LinkedListDataStructureController {

    @Autowired
    private LinkedListVisualizationFacade linkedListVisualizationFacade;

    private String validateArray(List<Double> array) {
        if (array == null || array.isEmpty()) {
            return "Linked list cannot be empty";
        }
        if (array.size() < 2 || array.size() > 100) {
            return "Linked list must have between 2 and 100 elements";
        }
        for (Double val : array) {
            if (val == null) {
                return "Please enter valid numbers only";
            }
            if (val < -1000000 || val > 1000000) {
                return "Values must be between -1000000 and 1000000";
            }
            String str = val.toString();
            int dotIndex = str.indexOf('.');
            if (dotIndex != -1 && str.length() - dotIndex - 1 > 5) {
                return "Values can have up to 5 decimal places only";
            }
        }
        return null;
    }

    @PostMapping("/access")
    public ResponseEntity<?> accessByIndex(@RequestBody ArrayOperationRequest request) {
        if (request.getArray() == null || request.getArray().isEmpty()) {
            return ResponseEntity.badRequest().body("Linked list cannot be null or empty");
        }
        
        String validationError = validateArray(request.getArray());
        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }
        
        if (request.getIndex() == null || request.getIndex() < 0 || request.getIndex().intValue() >= request.getArray().size()) {
            return ResponseEntity.badRequest().body("Invalid index");
        }

        try {
            String listType = request.getListType() != null ? request.getListType() : "normal";
            var steps = linkedListVisualizationFacade.accessByIndex(
                request.getArray(),
                request.getIndex().intValue(),
                listType
            );
            AlgorithmResponse response = new AlgorithmResponse();
            response.setSteps(steps);
            response.setTotalSteps(steps.size());
            response.setAlgorithmType("LINKED_LIST_ACCESS");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing access: " + e.getMessage());
        }
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateAtPosition(@RequestBody ArrayOperationRequest request){
        if (request.getArray() == null || request.getArray().isEmpty()) {
            return ResponseEntity.badRequest().body("Linked list cannot be null or empty");
        }

        String validationError = validateArray(request.getArray());
        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }

        if (request.getIndex() == null || request.getIndex() < 0 || request.getIndex().intValue() >= request.getArray().size()) {
            return ResponseEntity.badRequest().body("Invalid index");
        }
        if (request.getValue() == null) {
            return ResponseEntity.badRequest().body("Value cannot be null");
        }

        try {
            var steps = linkedListVisualizationFacade.updateAtPosition(request);
            AlgorithmResponse response = new AlgorithmResponse();
            response.setSteps(steps);
            response.setTotalSteps(steps.size());
            response.setAlgorithmType("LINKED_LIST_UPDATE");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing update: " + e.getMessage());
        }
    }

    @PostMapping("/insert-head")
    public ResponseEntity<?> insertAtHead(@RequestBody ArrayOperationRequest request) {
        if (request.getArray() == null || request.getArray().isEmpty()) {
            return ResponseEntity.badRequest().body("Linked list cannot be null or empty");
        }
        
        String validationError = validateArray(request.getArray());
        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }
        
        if (request.getValue() == null) {
            return ResponseEntity.badRequest().body("Value cannot be null");
        }

        try {
            var steps = linkedListVisualizationFacade.insertAtHead(request);
            AlgorithmResponse response = new AlgorithmResponse();
            response.setSteps(steps);
            response.setTotalSteps(steps.size());
            response.setAlgorithmType("LINKED_LIST_INSERT_HEAD");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing insert: " + e.getMessage());
        }
    }

    @PostMapping("/insert-tail")
    public ResponseEntity<?> insertAtTail(@RequestBody ArrayOperationRequest request) {
        if (request.getArray() == null || request.getArray().isEmpty()) {
            return ResponseEntity.badRequest().body("Linked list cannot be null or empty");
        }
        
        String validationError = validateArray(request.getArray());
        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }
        
        if (request.getValue() == null) {
            return ResponseEntity.badRequest().body("Value cannot be null");
        }

        try {
            var steps = linkedListVisualizationFacade.insertAtTail(request);
            AlgorithmResponse response = new AlgorithmResponse();
            response.setSteps(steps);
            response.setTotalSteps(steps.size());
            response.setAlgorithmType("LINKED_LIST_INSERT_TAIL");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing insert: " + e.getMessage());
        }
    }

    @PostMapping("/insert-position")
    public ResponseEntity<?> insertAtPosition(@RequestBody ArrayOperationRequest request) {
        if (request.getArray() == null || request.getArray().isEmpty()) {
            return ResponseEntity.badRequest().body("Linked list cannot be null or empty");
        }
        
        String validationError = validateArray(request.getArray());
        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }
        
        if (request.getIndex() == null || request.getIndex() < 0 || request.getIndex() > request.getArray().size()) {
            return ResponseEntity.badRequest().body("Invalid index");
        }
        if (request.getValue() == null) {
            return ResponseEntity.badRequest().body("Value cannot be null");
        }

        try {
            var steps = linkedListVisualizationFacade.insertAtPosition(request);
            AlgorithmResponse response = new AlgorithmResponse();
            response.setSteps(steps);
            response.setTotalSteps(steps.size());
            int index = request.getIndex().intValue();
            if (index == 0) {
                response.setAlgorithmType("LINKED_LIST_INSERT_HEAD");
            } else if (index == request.getArray().size()) {
                response.setAlgorithmType("LINKED_LIST_INSERT_TAIL");
            } else {
                response.setAlgorithmType("LINKED_LIST_INSERT_POSITION");
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing insert: " + e.getMessage());
        }
    }

    @PostMapping("/delete-head")
    public ResponseEntity<?> deleteAtHead(@RequestBody ArrayOperationRequest request) {
        if (request.getArray() == null || request.getArray().isEmpty()) {
            return ResponseEntity.badRequest().body("Linked list cannot be null or empty");
        }
        
        String validationError = validateArray(request.getArray());
        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }

        try {
            var steps = linkedListVisualizationFacade.deleteAtHead(request);
            AlgorithmResponse response = new AlgorithmResponse();
            response.setSteps(steps);
            response.setTotalSteps(steps.size());
            response.setAlgorithmType("LINKED_LIST_DELETE_HEAD");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing delete: " + e.getMessage());
        }
    }

    @PostMapping("/delete-tail")
    public ResponseEntity<?> deleteAtTail(@RequestBody ArrayOperationRequest request) {
        if (request.getArray() == null || request.getArray().isEmpty()) {
            return ResponseEntity.badRequest().body("Linked list cannot be null or empty");
        }
        
        String validationError = validateArray(request.getArray());
        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }

        try {
            var steps = linkedListVisualizationFacade.deleteAtTail(request);
            AlgorithmResponse response = new AlgorithmResponse();
            response.setSteps(steps);
            response.setTotalSteps(steps.size());
            response.setAlgorithmType("LINKED_LIST_DELETE_TAIL");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing delete: " + e.getMessage());
        }
    }

    @PostMapping("/delete-position")
    public ResponseEntity<?> deleteAtPosition(@RequestBody ArrayOperationRequest request) {
        if (request.getArray() == null || request.getArray().isEmpty()) {
            return ResponseEntity.badRequest().body("Linked list cannot be null or empty");
        }
        
        String validationError = validateArray(request.getArray());
        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }
        
        if (request.getIndex() == null || request.getIndex() < 0 || request.getIndex().intValue() >= request.getArray().size()) {
            return ResponseEntity.badRequest().body("Invalid index");
        }

        try {
            var steps = linkedListVisualizationFacade.deleteAtPosition(request);
            AlgorithmResponse response = new AlgorithmResponse();
            response.setSteps(steps);
            response.setTotalSteps(steps.size());
            response.setAlgorithmType("LINKED_LIST_DELETE_POSITION");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing delete: " + e.getMessage());
        }
    }

    @PostMapping("/search")
    public ResponseEntity<?> searchForValue(@RequestBody ArrayOperationRequest request) {
        if (request.getArray() == null || request.getArray().isEmpty()) {
            return ResponseEntity.badRequest().body("Linked list cannot be null or empty");
        }
        
        String validationError = validateArray(request.getArray());
        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }
        
        if (request.getValue() == null || request.getValue().isNaN()) {
            return ResponseEntity.badRequest().body("Value cannot be null");
        }

        try {
            var steps = linkedListVisualizationFacade.searchForValue(request);
            AlgorithmResponse response = new AlgorithmResponse();
            response.setSteps(steps);
            response.setTotalSteps(steps.size());
            response.setAlgorithmType("LINKED_LIST_SEARCH");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing search: " + e.getMessage());
        }
    }

    @PostMapping("/traverse")
    public ResponseEntity<?> traverseTheList(@RequestBody ArrayOperationRequest request){
        if (request.getArray() == null || request.getArray().isEmpty()) {
            return ResponseEntity.badRequest().body("Linked list cannot be null or empty");
        }

        String validationError = validateArray(request.getArray());
        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }

        try {
            var steps = linkedListVisualizationFacade.traverseTheArray(request);
            AlgorithmResponse response = new AlgorithmResponse();
            response.setSteps(steps);
            response.setTotalSteps(steps.size());
            response.setAlgorithmType("LINKED_LIST_TRAVERSE");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing traverse: " + e.getMessage());
        }
    }
}
