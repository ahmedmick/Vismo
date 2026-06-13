package startup.vsvisualizer.controller.datastructures.array;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import startup.vsvisualizer.dto.algorithms.AlgorithmResponse;
import startup.vsvisualizer.dto.datastructures.array.ArrayOperationRequest;
import startup.vsvisualizer.service.datastructures.array.impl.ArrayDataStructureService;

import java.util.List;

@RestController
@CrossOrigin(origins = "https://visualizer-frontend-production-9da8.up.railway.app")
@RequestMapping("/api/data-structures/array")
public class ArrayDataStructureController {

    @Autowired
    private ArrayDataStructureService arrayDataStructureService;

    private String validateArray(List<Double> array) {
        if (array == null || array.isEmpty()) {
            return "Array cannot be empty";
        }
        if (array.size() < 2 || array.size() > 100) {
            return "Array must have between 2 and 100 elements";
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
            return ResponseEntity.badRequest().body("Array cannot be null or empty");
        }
        
        String validationError = validateArray(request.getArray());
        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }
        
        if (request.getIndex() == null || request.getIndex() < 0 || request.getIndex().intValue() >= request.getArray().size()) {
            return ResponseEntity.badRequest().body("Invalid index");
        }

        try {
            var steps = arrayDataStructureService.accessByIndex(request);
            AlgorithmResponse response = new AlgorithmResponse();
            response.setSteps(steps);
            response.setTotalSteps(steps.size());
            response.setAlgorithmType("ARRAY_ACCESS");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing access: " + e.getMessage());
        }
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateAtPosition(@RequestBody ArrayOperationRequest request){
        if (request.getArray() == null || request.getArray().isEmpty()) {
            return ResponseEntity.badRequest().body("Array cannot be null or empty");
        }

        String validationError = validateArray(request.getArray());
        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }

        if (request.getIndex() == null || request.getIndex() < 0 || request.getIndex() >= request.getArray().size()) {
            return ResponseEntity.badRequest().body("Invalid index");
        }
        if (request.getValue() == null) {
            return ResponseEntity.badRequest().body("Value cannot be null");
        }

        try {
            var steps = arrayDataStructureService.updateAtPosition(request);
            AlgorithmResponse response = new AlgorithmResponse();
            response.setSteps(steps);
            response.setTotalSteps(steps.size());
            response.setAlgorithmType("ARRAY_UPDATE");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing update: " + e.getMessage());
        }
    }

    @PostMapping("/insert")
    public ResponseEntity<?> insertAtPosition(@RequestBody ArrayOperationRequest request) {
        if (request.getArray() == null || request.getArray().isEmpty()) {
            return ResponseEntity.badRequest().body("Array cannot be null or empty");
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
            var steps = arrayDataStructureService.insertAtPosition(request);
            AlgorithmResponse response = new AlgorithmResponse();
            response.setSteps(steps);
            response.setTotalSteps(steps.size());
            response.setAlgorithmType("ARRAY_INSERT");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing insert: " + e.getMessage());
        }
    }

    @PostMapping("/delete")
    public ResponseEntity<?> deleteAtPosition(@RequestBody ArrayOperationRequest request) {
        if (request.getArray() == null || request.getArray().isEmpty()) {
            return ResponseEntity.badRequest().body("Array cannot be null or empty");
        }
        
        String validationError = validateArray(request.getArray());
        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }
        
        if (request.getIndex() == null || request.getIndex() < 0 || request.getIndex() >= request.getArray().size()) {
            return ResponseEntity.badRequest().body("Invalid index");
        }

        try {
            var steps = arrayDataStructureService.deleteAtPosition(request);
            AlgorithmResponse response = new AlgorithmResponse();
            response.setSteps(steps);
            response.setTotalSteps(steps.size());
            response.setAlgorithmType("ARRAY_DELETE");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing delete: " + e.getMessage());
        }
    }

    @PostMapping("/search")
    public ResponseEntity<?> searchForValue(@RequestBody ArrayOperationRequest request) {
        if (request.getArray() == null || request.getArray().isEmpty()) {
            return ResponseEntity.badRequest().body("Array cannot be null or empty");
        }
        
        String validationError = validateArray(request.getArray());
        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }
        
        if (request.getValue() == null || request.getValue().isNaN()) {
            return ResponseEntity.badRequest().body("Value cannot be null");
        }

        try {
            var steps = arrayDataStructureService.searchForValue(request);
            AlgorithmResponse response = new AlgorithmResponse();
            response.setSteps(steps);
            response.setTotalSteps(steps.size());
            response.setAlgorithmType("ARRAY_SEARCH");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing search: " + e.getMessage());
        }
    }

    @PostMapping("/traverse")
    public ResponseEntity<?> traverseTheArray(@RequestBody ArrayOperationRequest request){
        if (request.getArray() == null || request.getArray().isEmpty()) {
            return ResponseEntity.badRequest().body("Array cannot be null or empty");
        }

        String validationError = validateArray(request.getArray());
        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }

        try {
            var steps = arrayDataStructureService.traverseTheArray(request);
            AlgorithmResponse response = new AlgorithmResponse();
            response.setSteps(steps);
            response.setTotalSteps(steps.size());
            response.setAlgorithmType("ARRAY_TRAVERSE");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing traverse: " + e.getMessage());
        }
    }
}
