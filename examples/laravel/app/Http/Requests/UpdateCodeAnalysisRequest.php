<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCodeAnalysisRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true; // No authentication required as per requirements
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'project_name' => 'sometimes|string|max:255',
            'language' => 'sometimes|string|max:100',
            'file_path' => 'sometimes|string|max:500',
            'lines_of_code' => 'sometimes|integer|min:0|max:999999',
            'complexity_score' => 'nullable|integer|min:0|max:100',
            'issues' => 'nullable|array',
            'issues.*' => 'string|max:500',
            'status' => ['sometimes', Rule::in(['pending', 'completed', 'failed'])],
            'description' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages()
    {
        return [
            'project_name.max' => 'Project name cannot exceed 255 characters.',
            'language.max' => 'Language name cannot exceed 100 characters.',
            'file_path.max' => 'File path cannot exceed 500 characters.',
            'lines_of_code.integer' => 'Lines of code must be a valid number.',
            'lines_of_code.min' => 'Lines of code cannot be negative.',
            'lines_of_code.max' => 'Lines of code cannot exceed 999,999.',
            'complexity_score.integer' => 'Complexity score must be a valid number.',
            'complexity_score.min' => 'Complexity score cannot be negative.',
            'complexity_score.max' => 'Complexity score cannot exceed 100.',
            'issues.array' => 'Issues must be provided as an array.',
            'status.in' => 'Status must be one of: pending, completed, failed.',
            'description.max' => 'Description cannot exceed 1000 characters.',
        ];
    }
}