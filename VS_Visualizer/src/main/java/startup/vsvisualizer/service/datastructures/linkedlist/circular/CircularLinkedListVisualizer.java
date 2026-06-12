package startup.vsvisualizer.service.datastructures.linkedlist.circular;

import org.springframework.stereotype.Service;
import startup.vsvisualizer.dto.datastructures.array.ArrayOperationRequest;
import startup.vsvisualizer.entity.visualization.VisualizationStep;
import startup.vsvisualizer.service.datastructures.linkedlist.LinkedListType;
import startup.vsvisualizer.service.datastructures.linkedlist.LinkedListVisualizer;
import startup.vsvisualizer.service.datastructures.linkedlist.circular.operations.CircularLinkedListOperations;

import java.util.List;

@Service
public class CircularLinkedListVisualizer implements LinkedListVisualizer {

    private final CircularLinkedListOperations operations;

    public CircularLinkedListVisualizer(CircularLinkedListOperations operations) {
        this.operations = operations;
    }

    @Override
    public LinkedListType getType() {
        return LinkedListType.CIRCULAR;
    }

    @Override
    public List<VisualizationStep> accessByIndex(List<Double> nodes, int targetIndex, String listType) {
        return operations.accessByIndex(nodes, targetIndex);
    }

    @Override
    public List<VisualizationStep> updateAtPosition(ArrayOperationRequest request) {
        return operations.updateAtPosition(request);
    }

    @Override
    public List<VisualizationStep> insertAtHead(ArrayOperationRequest request) {
        return operations.insertAtHead(request);
    }

    @Override
    public List<VisualizationStep> insertAtTail(ArrayOperationRequest request) {
        return operations.insertAtTail(request);
    }

    @Override
    public List<VisualizationStep> insertAtPosition(ArrayOperationRequest request) {
        return operations.insertAtPosition(request);
    }

    @Override
    public List<VisualizationStep> deleteAtHead(ArrayOperationRequest request) {
        return operations.deleteAtHead(request);
    }

    @Override
    public List<VisualizationStep> deleteAtTail(ArrayOperationRequest request) {
        return operations.deleteAtTail(request);
    }

    @Override
    public List<VisualizationStep> deleteAtPosition(ArrayOperationRequest request) {
        return operations.deleteAtPosition(request);
    }

    @Override
    public List<VisualizationStep> searchForValue(ArrayOperationRequest request) {
        return operations.searchForValue(request);
    }

    @Override
    public List<VisualizationStep> traverseTheArray(ArrayOperationRequest request) {
        return operations.traverseTheArray(request);
    }
}
