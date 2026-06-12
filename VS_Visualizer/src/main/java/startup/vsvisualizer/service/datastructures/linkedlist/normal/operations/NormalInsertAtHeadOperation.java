package startup.vsvisualizer.service.datastructures.linkedlist.normal.operations;

import org.springframework.stereotype.Component;
import startup.vsvisualizer.dto.datastructures.array.ArrayOperationRequest;
import startup.vsvisualizer.entity.visualization.CustomPointer;
import startup.vsvisualizer.entity.visualization.VisualizationStep;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static startup.vsvisualizer.service.datastructures.linkedlist.common.LinkedListVisualizationSupport.copyArray;
import static startup.vsvisualizer.service.datastructures.linkedlist.common.LinkedListVisualizationSupport.formatValue;

@Component
public class NormalInsertAtHeadOperation {

    public List<VisualizationStep> execute(ArrayOperationRequest request) {
        return execute(copyArray(request.getArray()), request.getValue());
    }

    public List<VisualizationStep> execute(List<Double> array, double value) {
        List<VisualizationStep> steps = new ArrayList<>();
        int stepNumber = 1;

        if (array.isEmpty()) {
            VisualizationStep createStep = new VisualizationStep();
            createStep.setStepNumber(stepNumber++);
            createStep.setDescription(String.format("Creating new node with value %s", formatValue(value)));
            createStep.setHighlightedIndices(new ArrayList<>());
            createStep.setTempPointerIndex(-1);
            createStep.setCurrentArray(new ArrayList<>());
            createStep.setFloatingNodeValue(value);
            createStep.setFloatingNodeLabel("newNode");
            steps.add(createStep);

            VisualizationStep headStep = new VisualizationStep();
            headStep.setStepNumber(stepNumber++);
            headStep.setDescription("Assign head = newNode (newHead)");
            headStep.setHighlightedIndices(new ArrayList<>());
            headStep.setTempPointerIndex(-1);
            headStep.setCurrentArray(new ArrayList<>());
            headStep.setFloatingNodeValue(value);
            headStep.setFloatingNodeLabel("newNode");
            headStep.setCustomPointers(new ArrayList<>(Arrays.asList(
                new CustomPointer("head", "floating", "head", true)
            )));
            steps.add(headStep);

            List<Double> result = new ArrayList<>(List.of(value));
            VisualizationStep finalStep = new VisualizationStep();
            finalStep.setStepNumber(stepNumber);
            finalStep.setDescription("Linked List after insertion\nO(1) - instant pointer update.");
            finalStep.setHighlightedIndices(new ArrayList<>(Arrays.asList(0)));
            finalStep.setTempPointerIndex(0);
            finalStep.setCurrentArray(result);
            steps.add(finalStep);
            return steps;
        }

        VisualizationStep step1 = new VisualizationStep();
        step1.setStepNumber(stepNumber++);
        step1.setDescription("Inserting a node in front of Linked List");
        step1.setHighlightedIndices(new ArrayList<>());
        step1.setTempPointerIndex(-1);
        step1.setCurrentArray(new ArrayList<>(array));
        step1.setFloatingNodeValue(value);
        step1.setFloatingNodeLabel("newNode");
        steps.add(step1);

        VisualizationStep step2 = new VisualizationStep();
        step2.setStepNumber(stepNumber++);
        step2.setDescription("Assign newNode -> next = head");
        step2.setHighlightedIndices(new ArrayList<>());
        step2.setTempPointerIndex(-1);
        step2.setCurrentArray(new ArrayList<>(array));
        step2.setFloatingNodeValue(value);
        step2.setFloatingNodeLabel("newNode");
        step2.setCustomPointers(new ArrayList<>(Arrays.asList(
            new CustomPointer("floating", "0", "next", true)
        )));
        steps.add(step2);

        VisualizationStep step3 = new VisualizationStep();
        step3.setStepNumber(stepNumber++);
        step3.setDescription("Assign head = newNode (newHead)");
        step3.setHighlightedIndices(new ArrayList<>());
        step3.setTempPointerIndex(-1);
        step3.setCurrentArray(new ArrayList<>(array));
        step3.setFloatingNodeValue(value);
        step3.setFloatingNodeLabel("newNode");
        step3.setCustomPointers(new ArrayList<>(Arrays.asList(
            new CustomPointer("floating", "0", "next", false),
            new CustomPointer("head", "floating", "head", true),
            new CustomPointer("head", "0", "deprecated-head", false)
        )));
        steps.add(step3);

        List<Double> result = new ArrayList<>(array);
        result.add(0, value);
        VisualizationStep step4 = new VisualizationStep();
        step4.setStepNumber(stepNumber);
        step4.setDescription("Linked List after insertion\nO(1) - instant pointer update.");
        step4.setHighlightedIndices(new ArrayList<>(Arrays.asList(0)));
        step4.setTempPointerIndex(0);
        step4.setCurrentArray(result);
        steps.add(step4);

        return steps;
    }
}
