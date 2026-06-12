package startup.vsvisualizer.controller.datastructures.array;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import startup.vsvisualizer.dto.algorithms.AlgorithmResponse;
import startup.vsvisualizer.dto.datastructures.array.ArrayRequest;
import startup.vsvisualizer.service.algorithms.bubblesort.impl.BubbleSortService;

import java.util.List;

@RestController
@RequestMapping("/api/array")
@CrossOrigin(origins = "visualizer-frontend-production-9da8.up.railway.app")
public class ArrayController {

    @Autowired
    private BubbleSortService bubbleSortService;

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

    @PostMapping("/bubble-sort")
    public ResponseEntity<?> bubbleSort(@RequestBody ArrayRequest request) {
        // Validate input
        if (request.getArray() == null || request.getArray().isEmpty()) {
            return ResponseEntity.badRequest().body("Array cannot be null or empty");
        }

        String validationError = validateArray(request.getArray());
        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }

        try {
            // Generate visualization steps
            var steps = bubbleSortService.generateSteps(request.getArray());

            // Build response
            AlgorithmResponse response = new AlgorithmResponse();
            response.setSteps(steps);
            response.setTotalSteps(steps.size());
            response.setAlgorithmType("BUBBLE_SORT");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing bubble sort: " + e.getMessage());
        }
    }
}
