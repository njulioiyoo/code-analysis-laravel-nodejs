<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CodeAnalysisResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'project_name' => $this->project_name,
            'language' => $this->language,
            'file_path' => $this->file_path,
            'lines_of_code' => $this->lines_of_code,
            'complexity_score' => $this->complexity_score,
            'issues' => $this->issues,
            'status' => $this->status,
            'description' => $this->description,
            'has_issues' => $this->hasIssues(),
            'is_completed' => $this->isCompleted(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}